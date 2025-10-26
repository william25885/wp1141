import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import type { CoffeeShop, Location } from '../types';

// Google Maps 類型定義
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  center: Location;
  coffeeShops: CoffeeShop[];
  onShopClick?: (shop: CoffeeShop) => void;
  height?: string | number;
  zoom?: number;
  showCurrentLocation?: boolean;
  currentLocation?: Location;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  coffeeShops,
  onShopClick,
  height = 400,
  zoom = 15,
  showCurrentLocation = false,
  currentLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const currentLocationMarkerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string>('');

  // 初始化地圖
  const initializeMap = () => {
    if (!mapRef.current || !window.google) {
      setMapError('Google Maps API 尚未載入');
      return;
    }

    try {
      // 建立地圖實例
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: center.lat, lng: center.lng },
        zoom: zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setIsMapLoaded(true);
      setMapError('');
    } catch (error) {
      console.error('地圖初始化錯誤:', error);
      setMapError('地圖初始化失敗');
    }
  };

  // 清除所有標記
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      if (marker) {
        marker.setMap(null);
      }
    });
    markersRef.current = [];
  };

  // 清除當前位置標記
  const clearCurrentLocationMarker = () => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
      currentLocationMarkerRef.current = null;
    }
  };

  // 建立當前位置標記
  const createCurrentLocationMarker = (location: Location) => {
    if (!mapInstanceRef.current || !window.google) return;

    // 清除舊的當前位置標記
    clearCurrentLocationMarker();

    // 建立當前位置標記圖示
    const currentLocationIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#fff" stroke-width="3"/>
          <circle cx="12" cy="12" r="3" fill="#fff"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(24, 24),
      anchor: new window.google.maps.Point(12, 12)
    };

    // 建立當前位置標記
    currentLocationMarkerRef.current = new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapInstanceRef.current,
      title: '我的位置',
      icon: currentLocationIcon,
      animation: window.google.maps.Animation.BOUNCE,
      zIndex: 1000 // 確保當前位置標記在最上層
    });

    // 建立當前位置資訊視窗
    const currentLocationInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #4285F4; font-size: 16px;">📍 我的位置</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">
            緯度: ${location.lat.toFixed(6)}<br>
            經度: ${location.lng.toFixed(6)}
          </p>
        </div>
      `
    });

    // 點擊當前位置標記顯示資訊（可選）
    currentLocationMarkerRef.current.addListener('click', () => {
      currentLocationInfoWindow.open(mapInstanceRef.current, currentLocationMarkerRef.current);
    });

    // 注意：不自動顯示資訊視窗，只顯示圖示標點
  };

  // 建立咖啡廳標記
  const createMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    clearMarkers();

    coffeeShops.forEach((shop) => {
      if (shop.lat && shop.lng) {
        // 建立自定義標記圖示
        const markerIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#8B4513" stroke="#fff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-family="Arial">☕</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        };

        const marker = new window.google.maps.Marker({
          position: { lat: shop.lat, lng: shop.lng },
          map: mapInstanceRef.current,
          title: shop.name,
          icon: markerIcon,
          animation: window.google.maps.Animation.DROP
        });

        // 建立資訊視窗
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #8B4513; font-size: 16px;">${shop.name}</h3>
              <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">
                <strong>評分:</strong> ${shop.rating ? shop.rating.toFixed(1) : 'N/A'} ⭐
              </p>
              <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">
                <strong>地址:</strong> ${shop.address}
              </p>
              ${shop.phone ? `<p style="margin: 0 0 4px 0; color: #666; font-size: 14px;"><strong>電話:</strong> ${shop.phone}</p>` : ''}
              ${shop.distance ? `<p style="margin: 0; color: #8B4513; font-size: 14px;"><strong>距離:</strong> ${shop.distance.toFixed(2)} 公里</p>` : ''}
            </div>
          `
        });

        // 點擊標記事件
        marker.addListener('click', () => {
          // 關閉其他資訊視窗
          markersRef.current.forEach(m => {
            if (m.infoWindow) {
              m.infoWindow.close();
            }
          });
          
          infoWindow.open(mapInstanceRef.current, marker);
          
          // 呼叫回調函數
          if (onShopClick) {
            onShopClick(shop);
          }
        });

        // 儲存標記和資訊視窗的引用
        marker.infoWindow = infoWindow;
        markersRef.current.push(marker);
      }
    });
  };

  // 更新地圖中心
  const updateMapCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: center.lat, lng: center.lng });
    }
  };

  // 監聽 Google Maps API 載入
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        // 如果 API 還沒載入，等待一下再檢查
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();

    // 清理函數
    return () => {
      clearMarkers();
      clearCurrentLocationMarker();
    };
  }, []);

  // 當中心點改變時更新地圖
  useEffect(() => {
    if (isMapLoaded) {
      updateMapCenter();
    }
  }, [center, isMapLoaded]);

  // 當咖啡廳清單改變時更新標記
  useEffect(() => {
    if (isMapLoaded) {
      createMarkers();
    }
  }, [coffeeShops, isMapLoaded]);

  // 當需要顯示當前位置時建立標記
  useEffect(() => {
    if (isMapLoaded && showCurrentLocation && currentLocation) {
      createCurrentLocationMarker(currentLocation);
    } else if (!showCurrentLocation) {
      clearCurrentLocationMarker();
    }
  }, [isMapLoaded, showCurrentLocation, currentLocation]);

  // 如果地圖載入失敗，顯示錯誤訊息
  if (mapError) {
    return (
      <Box
        sx={{
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.300'
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <Typography variant="body2">
            {mapError}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: height,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.300',
        boxShadow: 1
      }}
    >
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </Box>
  );
};

export default GoogleMap;
