import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Map as MapIcon,
  MyLocation as MyLocationIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Directions as DirectionsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import GoogleMap from '../components/GoogleMap';
import type { CoffeeShop, Location, FavoriteList } from '../types';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLocationButtonActive, setIsLocationButtonActive] = useState<boolean>(false);
  const [isSearchButtonActive, setIsSearchButtonActive] = useState<boolean>(false);
  
  // 收藏功能狀態
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);

  // 注意：搜尋範圍變更功能已移除，所有搜尋都固定使用 1000m 半徑

  // 載入收藏清單
  const loadFavoriteLists = async () => {
    try {
      const response = await apiService.getFavoriteLists();
      if (response.success) {
        setFavoriteLists(response.data);
        console.log('✅ 載入收藏清單成功:', response.data);
      }
    } catch (error: any) {
      console.error('❌ 載入收藏清單錯誤:', error);
    }
  };

  // 開啟收藏對話框
  const handleAddToFavorite = (shop: CoffeeShop) => {
    setSelectedShop(shop);
    setFavoriteDialogOpen(true);
  };

  // 加入收藏
  const handleAddToFavoriteList = async (listId: string) => {
    if (!selectedShop) return;

    try {
      const response = await apiService.addToFavorite({
        listId,
        placeId: selectedShop.placeId,
        placeName: selectedShop.name,
        rating: selectedShop.rating,
        reviewCount: selectedShop.reviewCount,
        phone: selectedShop.phone,
        address: selectedShop.address,
        distance: selectedShop.distance
      });

      if (response.success) {
        setFavoriteDialogOpen(false);
        setSelectedShop(null);
        console.log('✅ 加入收藏成功');
        // 可以在這裡顯示成功訊息
      } else {
        setError(response.message || '加入收藏失敗');
      }
    } catch (error: any) {
      console.error('❌ 加入收藏錯誤:', error);
      setError(error.message || '加入收藏失敗，請稍後再試');
    }
  };

  // 取得使用者位置（高精度定位）
  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('此瀏覽器不支援地理位置功能'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          console.log('📍 取得精確位置:', {
            latitude: location.lat,
            longitude: location.lng,
            accuracy: position.coords.accuracy + ' 公尺',
            timestamp: new Date(position.timestamp).toLocaleString()
          });
          
          resolve(location);
        },
        (error) => {
          console.error('❌ 地理位置錯誤:', error);
          let errorMessage = '無法取得位置資訊：';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += '使用者拒絕了地理位置請求';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += '位置資訊不可用';
              break;
            case error.TIMEOUT:
              errorMessage += '位置請求超時';
              break;
            default:
              errorMessage += error.message;
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true, // 啟用高精度定位
          timeout: 15000, // 增加超時時間到 15 秒
          maximumAge: 60000, // 減少快取時間到 1 分鐘，確保位置較新
        }
      );
    });
  };

  // 搜尋附近咖啡廳（固定 1000m 半徑）
  const searchNearbyCoffeeShops = async (location: Location) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log(`🔍 搜尋咖啡廳: 位置(${location.lat}, ${location.lng}), 固定範圍 1000m`);
      
      const response = await apiService.searchNearby(location.lat, location.lng, 1000);
      
      if (response.success) {
        setCoffeeShops(response.data.coffeeShops);
        setCurrentLocation(location);
        console.log(`✅ 找到 ${response.data.coffeeShops.length} 間咖啡廳`);
      } else {
        setError(response.message || '搜尋失敗');
      }
    } catch (error: any) {
      console.error('搜尋咖啡廳錯誤:', error);
      
      // 根據錯誤類型提供更詳細的錯誤訊息
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        setError('無法連接伺服器，請檢查網路連接或確認後端伺服器是否正在運行');
      } else if (error.response?.status === 404) {
        setError('找不到搜尋服務，請聯繫管理員');
      } else if (error.response?.status >= 500) {
        setError('伺服器錯誤，請稍後再試');
      } else if (error.message?.includes('CORS')) {
        setError('跨域請求被阻擋，請檢查伺服器設定');
      } else {
        setError(error.message || '搜尋失敗，請稍後再試');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 根據地址搜尋咖啡廳（固定 1000m 半徑）
  const searchByAddress = async () => {
    if (!searchAddress.trim()) {
      setError('請輸入搜尋地址');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setIsLocationButtonActive(false); // 重置位置按鈕狀態
      setIsSearchButtonActive(true); // 設定搜尋按鈕為活動狀態
      
      console.log('🏠 地址搜尋，固定半徑 1000m');
      
      const response = await apiService.searchByAddress(searchAddress.trim(), 1000); // 固定使用 1000m
      
      if (response.success) {
        setCoffeeShops(response.data.coffeeShops);
        setCurrentLocation(response.data.location);
        console.log(`✅ 地址搜尋找到 ${response.data.coffeeShops.length} 間咖啡廳`);
      } else {
        setError(response.message || '搜尋失敗');
      }
    } catch (error: any) {
      console.error('地址搜尋錯誤:', error);
      
      // 根據錯誤類型提供更詳細的錯誤訊息
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        setError('無法連接伺服器，請檢查網路連接或確認後端伺服器是否正在運行');
      } else if (error.response?.status === 404) {
        setError('找不到搜尋服務，請聯繫管理員');
      } else if (error.response?.status >= 500) {
        setError('伺服器錯誤，請稍後再試');
      } else if (error.message?.includes('CORS')) {
        setError('跨域請求被阻擋，請檢查伺服器設定');
      } else {
        setError(error.message || '搜尋失敗，請稍後再試');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 使用當前位置搜尋（固定 1000m 半徑）
  const handleUseCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError('');
      setIsSearchButtonActive(false); // 重置搜尋按鈕狀態
      setIsLocationButtonActive(true); // 設定位置按鈕為活動狀態
      
      console.log('📍 使用當前位置搜尋，固定半徑 1000m');
      
      const location = await getCurrentLocation();
      await searchNearbyCoffeeShops(location); // 使用固定 1000m 半徑
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      setIsLocationButtonActive(false);
    }
  };

  // 處理搜尋表單提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchByAddress();
  };

  // 初始化載入收藏清單
  useEffect(() => {
    if (user) {
      loadFavoriteLists();
    }
  }, [user]);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      minWidth: 0
    }}>
      {/* 搜尋區域 */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, sm: 4, md: 5, lg: 6, xl: 7 },
          mb: { xs: 3, sm: 4, md: 5 },
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
          color: 'white',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
            fontWeight: 600,
            mb: { xs: 2, sm: 3 },
            textAlign: 'center'
          }}
        >
          ☕ 找到您附近的咖啡廳
        </Typography>
        
        {/* 搜尋表單 */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
            <Grid size={{ xs: 12, sm: 8, md: 9, lg: 10 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="輸入地址或地點名稱..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    minHeight: { xs: '48px', sm: '52px', md: '56px' },
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3, lg: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 2 }, 
                flexDirection: { xs: 'column', sm: 'row' },
                height: '100%'
              }}>
                <Button
                  type="submit"
                  variant={isSearchButtonActive ? "contained" : "outlined"}
                  fullWidth
                  disabled={isLoading}
                  sx={{ 
                    backgroundColor: isSearchButtonActive ? 'white' : 'transparent',
                    color: isSearchButtonActive ? 'primary.main' : 'white',
                    borderColor: 'white',
                    minHeight: { xs: '48px', sm: '52px', md: '56px' },
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: isSearchButtonActive ? 'grey.100' : 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                    '&:active': {
                      backgroundColor: isSearchButtonActive ? 'grey.200' : 'rgba(255,255,255,0.25)',
                      transform: 'translateY(0px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                    '&:disabled': {
                      backgroundColor: isSearchButtonActive ? 'grey.300' : 'transparent',
                      color: isSearchButtonActive ? 'grey.500' : 'rgba(255,255,255,0.5)',
                      borderColor: 'rgba(255,255,255,0.3)',
                      transform: 'none',
                      boxShadow: 'none',
                    }
                  }}
                >
                  {isLoading ? <CircularProgress size={20} /> : '搜尋'}
                </Button>
                <Button
                  variant={isLocationButtonActive ? "contained" : "outlined"}
                  fullWidth
                  onClick={handleUseCurrentLocation}
                  disabled={isLoading}
                  startIcon={<MyLocationIcon />}
                  sx={{ 
                    borderColor: 'white',
                    color: isLocationButtonActive ? 'primary.main' : 'white',
                    backgroundColor: isLocationButtonActive ? 'white' : 'transparent',
                    minHeight: { xs: '48px', sm: '52px', md: '56px' },
                    fontWeight: 600,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: isLocationButtonActive ? 'grey.100' : 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                    '&:active': {
                      backgroundColor: isLocationButtonActive ? 'grey.200' : 'rgba(255,255,255,0.25)',
                      transform: 'translateY(0px)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                    '&:disabled': {
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'rgba(255,255,255,0.5)',
                      backgroundColor: isLocationButtonActive ? 'grey.300' : 'transparent',
                      transform: 'none',
                      boxShadow: 'none',
                    }
                  }}
                >
                  我的位置
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* 搜尋範圍說明 */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: { xs: 1, sm: 2 }, opacity: 0.9 }}>
            🔍 搜尋範圍：固定 1000m 半徑
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
            所有搜尋都使用 1000m 半徑，確保一致的搜尋體驗
          </Typography>
        </Box>
      </Paper>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 地圖顯示區域 - 只要有搜尋位置就顯示 */}
      {currentLocation && (
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              mb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <MapIcon color="primary" />
            地圖檢視
            {coffeeShops.length > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  ml: 1,
                  fontSize: '0.9rem'
                }}
              >
                (找到 {coffeeShops.length} 間咖啡廳)
              </Typography>
            )}
          </Typography>
          <GoogleMap
            center={currentLocation}
            coffeeShops={coffeeShops}
            height={{ xs: 300, sm: 400, md: 500 }}
            zoom={15}
            showCurrentLocation={true}
            currentLocation={currentLocation}
            onShopClick={(shop) => {
              console.log('點擊咖啡廳:', shop);
              // 可以在這裡加入更多互動功能
            }}
          />
        </Box>
      )}

      {/* 搜尋結果 */}
      {coffeeShops.length > 0 && (
        <Box>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            <LocationIcon color="primary" />
            找到 {coffeeShops.length} 間咖啡廳
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                ml: { xs: 0, sm: 1 },
                mt: { xs: 0.5, sm: 0 }
              }}
            >
              (搜尋範圍: 1000m)
            </Typography>
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
            {coffeeShops.map((shop) => {
              return (
                <Grid 
                  size={{ 
                    xs: 12, 
                    sm: 6, 
                    md: 4, 
                    lg: 3, 
                    xl: 3 
                  }} 
                  key={shop.placeId}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2
                      }}
                    >
                      {/* 咖啡廳名稱和評分 - 固定高度區域 */}
                      <Box 
                        sx={{ 
                          mb: 2,
                          minHeight: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            fontWeight: 600,
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 1
                          }}
                        >
                          {shop.name}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          flexShrink: 0
                        }}>
                          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {shop.rating?.toFixed(1) || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 地址和距離 - 固定高度區域 */}
                      <Box 
                        sx={{ 
                          mb: 2,
                          minHeight: '60px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 0.5,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 1
                          }}
                        >
                          <LocationIcon sx={{ fontSize: 14, mt: 0.1, flexShrink: 0 }} />
                          <span>{shop.address}</span>
                        </Typography>
                        {shop.distance && (
                          <Typography 
                            variant="body2" 
                            color="primary.main"
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              fontWeight: 500
                            }}
                          >
                            📍 距離 {shop.distance.toFixed(2)} 公里
                          </Typography>
                        )}
                      </Box>

                      {/* 電話和評論數 - 固定高度區域 */}
                      <Box 
                        sx={{ 
                          mb: 2,
                          minHeight: '50px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        {shop.phone && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mb: 0.5
                            }}
                          >
                            <PhoneIcon sx={{ fontSize: 14 }} />
                            {shop.phone}
                          </Typography>
                        )}
                        {shop.reviewCount && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                          >
                            💬 {shop.reviewCount} 則評論
                          </Typography>
                        )}
                      </Box>

                      {/* 操作按鈕 - 固定在底部 */}
                      <Box 
                        sx={{ 
                          mt: 'auto',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 1,
                          pt: 1
                        }}
                      >
                        <Tooltip title="加入收藏">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleAddToFavorite(shop)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="查看地圖">
                          <IconButton size="small" color="primary">
                            <DirectionsIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* 沒有搜尋結果但有位置的提示 */}
      {!isLoading && coffeeShops.length === 0 && !error && currentLocation && (
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          backgroundColor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.200',
          mb: 4
        }}>
          <SearchIcon sx={{ 
            fontSize: { xs: 40, sm: 50 }, 
            color: 'grey.400', 
            mb: 2
          }} />
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              mb: 2,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            附近 1000m 範圍內沒有找到咖啡廳
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              maxWidth: { xs: '300px', sm: '400px' },
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            建議嘗試其他地址或使用上方的「我的位置」功能搜尋不同區域的咖啡廳
          </Typography>
        </Box>
      )}

      {/* 空狀態 - 只有在沒有搜尋位置時才顯示 */}
      {!isLoading && coffeeShops.length === 0 && !error && !currentLocation && (
        <Box sx={{ 
          textAlign: 'center', 
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 'calc(100vh - 400px)', sm: 'calc(100vh - 450px)', md: 'calc(100vh - 500px)' },
          maxHeight: { xs: '500px', sm: '600px', md: '700px' }
        }}>
          <SearchIcon sx={{ 
            fontSize: { xs: 60, sm: 80, md: 100 }, 
            color: 'grey.400', 
            mb: { xs: 2, sm: 3 }
          }} />
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              mb: { xs: 2, sm: 3 },
              fontWeight: 600
            }}
          >
            開始搜尋咖啡廳
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              maxWidth: { xs: '300px', sm: '400px', md: '500px' },
              lineHeight: 1.6
            }}
          >
            使用上方的搜尋功能輸入地址或點擊「我的位置」來找到附近的咖啡廳
          </Typography>
        </Box>
      )}

      {/* 收藏對話框 */}
      <Dialog open={favoriteDialogOpen} onClose={() => setFavoriteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>加入收藏</DialogTitle>
        <DialogContent>
          {selectedShop && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedShop.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                選擇要加入的收藏清單：
              </Typography>
            </Box>
          )}
          
          {favoriteLists.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                您還沒有收藏清單
              </Typography>
              <Typography variant="body2" color="text.secondary">
                請先到收藏頁面建立清單
              </Typography>
            </Box>
          ) : (
            <List>
              {favoriteLists.map((list) => (
                <ListItem
                  key={list.id}
                  onClick={() => handleAddToFavoriteList(list.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    }
                  }}
                >
                  <ListItemText
                    primary={list.name}
                    secondary={`建立於 ${new Date(list.createdAt).toLocaleDateString('zh-TW')}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFavoriteDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
