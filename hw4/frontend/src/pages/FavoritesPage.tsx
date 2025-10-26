import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Add as AddIcon,
  List as ListIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { FavoriteList, FavoriteItem } from '../types';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  
  // 狀態管理
  const [favoriteLists, setFavoriteLists] = useState<FavoriteList[]>([]);
  const [selectedList, setSelectedList] = useState<FavoriteList | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // 對話框狀態
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [listName, setListName] = useState<string>('');
  const [editingList, setEditingList] = useState<FavoriteList | null>(null);
  const [deletingList, setDeletingList] = useState<FavoriteList | null>(null);
  
  // 選單狀態
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuList, setMenuList] = useState<FavoriteList | null>(null);

  // 載入收藏清單
  const loadFavoriteLists = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiService.getFavoriteLists();
      if (response.success) {
        setFavoriteLists(response.data);
        console.log('✅ 載入收藏清單成功:', response.data);
      } else {
        setError(response.message || '載入收藏清單失敗');
      }
    } catch (error: any) {
      console.error('❌ 載入收藏清單錯誤:', error);
      setError(error.message || '載入收藏清單失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 載入收藏項目
  const loadFavoriteItems = async (listId: string) => {
    try {
      const response = await apiService.getFavoriteItems(listId);
      if (response.success) {
        setFavoriteItems(response.data || []);
        console.log('✅ 載入收藏項目成功:', response.data);
      } else {
        setError(response.message || '載入收藏項目失敗');
      }
    } catch (error: any) {
      console.error('❌ 載入收藏項目錯誤:', error);
      setError(error.message || '載入收藏項目失敗，請稍後再試');
    }
  };

  // 建立收藏清單
  const handleCreateList = async () => {
    if (!listName.trim()) {
      setError('請輸入清單名稱');
      return;
    }

    try {
      const response = await apiService.createFavoriteList({ name: listName.trim() });
      if (response.success) {
        setCreateDialogOpen(false);
        setListName('');
        setError(''); // 清除錯誤訊息
        await loadFavoriteLists();
        console.log('✅ 建立收藏清單成功');
      } else {
        setError(response.message || '建立收藏清單失敗');
      }
    } catch (error: any) {
      console.error('❌ 建立收藏清單錯誤:', error);
      
      // 處理 409 衝突錯誤（重複名稱）
      if (error.response?.status === 409) {
        setError('已存在相同名稱的收藏清單，請使用不同的名稱');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('建立收藏清單失敗，請稍後再試');
      }
    }
  };

  // 編輯收藏清單
  const handleEditList = async () => {
    if (!listName.trim() || !editingList) {
      setError('請輸入清單名稱');
      return;
    }

    try {
      const response = await apiService.updateFavoriteList(editingList.id, { name: listName.trim() });
      if (response.success) {
        setEditDialogOpen(false);
        setListName('');
        setEditingList(null);
        setError(''); // 清除錯誤訊息
        await loadFavoriteLists();
        console.log('✅ 編輯收藏清單成功');
      } else {
        setError(response.message || '編輯收藏清單失敗');
      }
    } catch (error: any) {
      console.error('❌ 編輯收藏清單錯誤:', error);
      
      // 處理 409 衝突錯誤（重複名稱）
      if (error.response?.status === 409) {
        setError('已存在相同名稱的收藏清單，請使用不同的名稱');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('編輯收藏清單失敗，請稍後再試');
      }
    }
  };

  // 刪除收藏清單
  const handleDeleteList = async () => {
    if (!deletingList) return;

    try {
      const response = await apiService.deleteFavoriteList(deletingList.id);
      if (response.success) {
        setDeleteDialogOpen(false);
        setDeletingList(null);
        setSelectedList(null);
        setFavoriteItems([]);
        await loadFavoriteLists();
        console.log('✅ 刪除收藏清單成功');
      } else {
        setError(response.message || '刪除收藏清單失敗');
      }
    } catch (error: any) {
      console.error('❌ 刪除收藏清單錯誤:', error);
      setError(error.message || '刪除收藏清單失敗，請稍後再試');
    }
  };

  // 刪除收藏項目
  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await apiService.removeFromFavorite(itemId);
      if (response.success) {
        if (selectedList) {
          await loadFavoriteItems(selectedList.id);
        }
        console.log('✅ 刪除收藏項目成功');
      } else {
        setError(response.message || '刪除收藏項目失敗');
      }
    } catch (error: any) {
      console.error('❌ 刪除收藏項目錯誤:', error);
      setError(error.message || '刪除收藏項目失敗，請稍後再試');
    }
  };

  // 選單處理
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, list: FavoriteList) => {
    setAnchorEl(event.currentTarget);
    setMenuList(list);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuList(null);
  };

  const handleEditClick = () => {
    if (menuList) {
      setEditingList(menuList);
      setListName(menuList.name);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuList) {
      setDeletingList(menuList);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  // 選擇清單
  const handleSelectList = (list: FavoriteList) => {
    setSelectedList(list);
    loadFavoriteItems(list.id);
  };

  // 初始化載入
  useEffect(() => {
    if (user) {
      loadFavoriteLists();
    }
  }, [user]);

  return (
    <Box>
      {/* 頁面標題 */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          mb: { xs: 3, sm: 4 },
          background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
          color: 'white',
          borderRadius: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <FavoriteIcon sx={{ 
            fontSize: { xs: 35, sm: 40, md: 45 }, 
            mr: { xs: 0, sm: 2 },
            mb: { xs: 1, sm: 0 }
          }} />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
              fontWeight: 600
            }}
          >
            我的收藏
          </Typography>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.9,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          管理您的咖啡廳收藏清單
        </Typography>
      </Paper>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 主要內容區域 */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* 收藏清單列表 */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}>
                  <ListIcon sx={{ mr: 1, color: 'primary.main' }} />
                  收藏清單
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                  sx={{ 
                    minWidth: 'auto',
                    px: 2
                  }}
                >
                  新增
                </Button>
              </Box>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : favoriteLists.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <ListIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2">
                    還沒有收藏清單
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 1 }}>
                    點擊「新增」建立第一個清單
                  </Typography>
                </Box>
              ) : (
                <List>
                  {favoriteLists.map((list) => (
                    <ListItem
                      key={list.id}
                      onClick={() => handleSelectList(list)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: selectedList?.id === list.id ? 'primary.light' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedList?.id === list.id ? 'primary.light' : 'grey.100',
                        }
                      }}
                    >
                      <ListItemText
                        primary={list.name}
                        secondary={`建立於 ${new Date(list.createdAt).toLocaleDateString('zh-TW')}`}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: selectedList?.id === list.id ? 600 : 400
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.75rem'
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, list)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 收藏項目列表 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {selectedList ? (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}>
                      {selectedList.name}
                    </Typography>
                    <Chip 
                      label={`${favoriteItems.length} 個項目`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {favoriteItems.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 6,
                      color: 'text.secondary'
                    }}>
                      <FavoriteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" gutterBottom>
                        這個清單還沒有咖啡廳
                      </Typography>
                      <Typography variant="body2">
                        在搜尋頁面將咖啡廳加入收藏
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {favoriteItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText
                              primary={
                                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {item.placeName}
                                  </Typography>
                                  {item.rating && (
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                                      <Typography component="span" variant="body2" color="text.secondary">
                                        {item.rating.toFixed(1)}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box component="span" sx={{ display: 'block' }}>
                                  {item.address && (
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                      <LocationIcon sx={{ fontSize: 14 }} />
                                      <Typography component="span" variant="body2" color="text.secondary">
                                        {item.address}
                                      </Typography>
                                    </Box>
                                  )}
                                  {item.phone && (
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                      <PhoneIcon sx={{ fontSize: 14 }} />
                                      <Typography component="span" variant="body2" color="text.secondary">
                                        {item.phone}
                                      </Typography>
                                    </Box>
                                  )}
                                  {item.distance && (
                                    <Typography component="span" variant="body2" color="primary.main">
                                      距離 {item.distance.toFixed(2)} 公里
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < favoriteItems.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6,
                  color: 'text.secondary'
                }}>
                  <FavoriteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" gutterBottom>
                    選擇一個收藏清單
                  </Typography>
                  <Typography variant="body2">
                    從左側選擇清單來查看收藏的咖啡廳
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 建立收藏清單對話框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>建立收藏清單</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="清單名稱"
            fullWidth
            variant="outlined"
            value={listName}
            onChange={(e) => {
              setListName(e.target.value);
              if (error) setError(''); // 清除錯誤訊息
            }}
            placeholder="例如：工作咖啡廳、約會咖啡廳..."
            sx={{ mt: 2 }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setListName('');
            setError('');
          }}>取消</Button>
          <Button onClick={handleCreateList} variant="contained">建立</Button>
        </DialogActions>
      </Dialog>

      {/* 編輯收藏清單對話框 */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>編輯收藏清單</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="清單名稱"
            fullWidth
            variant="outlined"
            value={listName}
            onChange={(e) => {
              setListName(e.target.value);
              if (error) setError(''); // 清除錯誤訊息
            }}
            sx={{ mt: 2 }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setListName('');
            setEditingList(null);
            setError('');
          }}>取消</Button>
          <Button onClick={handleEditList} variant="contained">儲存</Button>
        </DialogActions>
      </Dialog>

      {/* 刪除收藏清單對話框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>刪除收藏清單</DialogTitle>
        <DialogContent>
          <Typography>
            確定要刪除「{deletingList?.name}」嗎？這個動作無法復原。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button onClick={handleDeleteList} variant="contained" color="error">刪除</Button>
        </DialogActions>
      </Dialog>

      {/* 清單操作選單 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1 }} />
          編輯
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          刪除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FavoritesPage;
