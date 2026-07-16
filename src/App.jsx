import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// Subcomponent: Clipboard Manager
// ==========================================
function ClipboardManager() {
  const [copyText, setCopyText] = useState('Hello from Browser Check!');
  const [readText, setReadText] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [pasteStatus, setPasteStatus] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setReadText(text);
      setPasteStatus('Success');
      setTimeout(() => setPasteStatus(''), 2000);
    } catch (err) {
      setPasteStatus('Denied or empty');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">📋</span> Clipboard Access
        </h3>
        <span className="badge badge-neutral">Limited API</span>
      </div>
      <div className="details-list" style={{ marginBottom: '1.25rem' }}>
        <div className="detail-item">
          <span className="detail-label">Write Status</span>
          <span className="detail-value">{copyStatus || 'Idle'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Read Status</span>
          <span className="detail-value">{pasteStatus || 'Idle'}</span>
        </div>
      </div>
      <div className="clipboard-box">
        <input
          type="text"
          className="clipboard-input"
          value={copyText}
          onChange={(e) => setCopyText(e.target.value)}
          placeholder="Text to copy"
        />
        <button className="btn btn-primary" onClick={handleCopy} style={{ width: 'auto' }}>
          Copy
        </button>
      </div>
      <button className="btn btn-secondary" onClick={handlePaste} style={{ marginBottom: '1rem' }}>
        Paste Clipboard Content
      </button>
      {readText && (
        <div className="file-preview">
          <strong>Pasted Content:</strong>
          <span style={{ wordBreak: 'break-all', marginTop: '0.25rem' }}>{readText}</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Subcomponent: File Upload Scanner
// ==========================================
function FileUploadScanner() {
  const [fileDetails, setFileDetails] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type || 'Unknown MIME type',
      lastModified: new Date(file.lastModified).toLocaleString(),
    });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImgPreview('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">📁</span> File Explorer Upload
        </h3>
        <span className="badge badge-neutral">User Initiated</span>
      </div>
      <div
        className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <span className="upload-icon">📤</span>
        <p className="upload-text">
          Drag and drop a file here, or <span>browse files</span>
        </p>
      </div>

      {fileDetails && (
        <div className="file-preview">
          <div><strong>Name:</strong> {fileDetails.name}</div>
          <div><strong>MIME Type:</strong> {fileDetails.type}</div>
          <div><strong>Size:</strong> {fileDetails.size}</div>
          <div><strong>Last Modified:</strong> {fileDetails.lastModified}</div>
          {imgPreview && (
            <img src={imgPreview} alt="Thumbnail preview" className="file-image-thumb" />
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Subcomponent: Storage Inspector
// ==========================================
function StorageInspector() {
  const [cookieCount, setCookieCount] = useState(0);
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const [sessionStorageCount, setSessionStorageCount] = useState(0);
  const [testItems, setTestItems] = useState([]);

  const updateStorageStats = () => {
    // Cookies
    const cookies = document.cookie ? document.cookie.split(';') : [];
    setCookieCount(cookies.length);

    // Local Storage
    setLocalStorageCount(localStorage.length);

    // Session Storage
    setSessionStorageCount(sessionStorage.length);

    // List some items
    const items = [];
    for (let i = 0; i < Math.min(localStorage.length, 3); i++) {
      const key = localStorage.key(i);
      items.push({ type: 'Local', key, value: localStorage.getItem(key) });
    }
    for (let i = 0; i < Math.min(sessionStorage.length, 3); i++) {
      const key = sessionStorage.key(i);
      items.push({ type: 'Session', key, value: sessionStorage.getItem(key) });
    }
    setTestItems(items);
  };

  const handleAddTest = () => {
    localStorage.setItem(`test_local_${Date.now()}`, 'local_value_data');
    sessionStorage.setItem(`test_session_${Date.now()}`, 'session_value_data');
    document.cookie = `test_cookie_${Date.now()}=cookie_val; path=/; max-age=60`;
    updateStorageStats();
  };

  const handleClear = () => {
    // clear our keys only to prevent breaking anything, or clear all
    localStorage.clear();
    sessionStorage.clear();
    // Clear cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    updateStorageStats();
  };

  useEffect(() => {
    updateStorageStats();
    window.addEventListener('storage', updateStorageStats);
    return () => window.removeEventListener('storage', updateStorageStats);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">💾</span> Cookies & Web Storage
        </h3>
        <span className="badge badge-neutral">No Permission Req.</span>
      </div>
      <div className="details-list" style={{ marginBottom: '1.25rem' }}>
        <div className="detail-item">
          <span className="detail-label">Cookies Count</span>
          <span className="detail-value">{cookieCount} cookies</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Local Storage Key Count</span>
          <span className="detail-value">{localStorageCount} keys</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Session Storage Key Count</span>
          <span className="detail-value">{sessionStorageCount} keys</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={handleAddTest}>
          Insert Test Data
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear All
        </button>
      </div>

      {testItems.length > 0 && (
        <div className="file-preview">
          <strong>Inspect Storage Contents (Max 6 shown):</strong>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', lineHeight: '1.4' }}>
            {testItems.map((item, idx) => (
              <li key={idx} style={{ wordBreak: 'break-all' }}>
                <span style={{ color: item.type === 'Local' ? 'var(--color-primary)' : 'var(--color-secondary)', fontWeight: '600' }}>
                  [{item.type}]
                </span>{' '}
                {item.key}: {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Subcomponent: WebGL & Canvas Fingerprinting
// ==========================================
function FingerprintSignal() {
  const [gpuInfo, setGpuInfo] = useState({ vendor: 'Unknown', renderer: 'Unknown' });
  const [fingerprint, setFingerprint] = useState('Generating...');
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    // WebGL / GPU info
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          setGpuInfo({
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Canvas Fingerprinting
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('BrowserCheck Fingerprint!', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('CanvasFingerprint123', 4, 30);
        const dataUrl = canvas.toDataURL();
        
        // Quick and simple hash function for canvas dataURL
        let hash = 0;
        for (let i = 0; i < dataUrl.length; i++) {
          const char = dataUrl.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        setFingerprint('FP-' + Math.abs(hash).toString(16).toUpperCase());
      }
    } catch (e) {
      setFingerprint('Fingerprinting Blocked');
    }

    // Basic Font Detection (via Canvas Width Comparison)
    const detectFonts = () => {
      const baseFonts = ['monospace', 'sans-serif', 'serif'];
      const testFonts = [
        'Arial', 'Courier New', 'Georgia', 'Impact', 'Times New Roman',
        'Trebuchet MS', 'Comic Sans MS', 'Verdana', 'Calibri', 'Papyrus'
      ];
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
      ctx.font = '72px monospace';
      const defaultWidth = ctx.measureText(text).width;
      
      const detected = [];
      testFonts.forEach((font) => {
        ctx.font = `72px "${font}", monospace`;
        const testWidth = ctx.measureText(text).width;
        // If width differs, font is likely installed
        if (testWidth !== defaultWidth) {
          detected.push(font);
        }
      });
      
      setFonts(detected);
    };

    detectFonts();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">🎨</span> Canvas / WebGL & Fonts
        </h3>
        <span className="badge badge-neutral">No Permission Req.</span>
      </div>
      <div className="details-list" style={{ marginBottom: '1rem' }}>
        <div className="detail-item">
          <span className="detail-label">GPU Vendor</span>
          <span className="detail-value" style={{ fontSize: '0.8rem' }}>{gpuInfo.vendor}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">GPU Renderer</span>
          <span className="detail-value" style={{ fontSize: '0.8rem' }}>{gpuInfo.renderer}</span>
        </div>
        <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span className="detail-label">Canvas Unique Fingerprint</span>
          <div className="fingerprint-value" style={{ width: '100%' }}>{fingerprint}</div>
        </div>
        <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
          <span className="detail-label">Available Fonts ({fonts.length} Detected)</span>
          <div className="fonts-list">
            {fonts.map((f, i) => (
              <span key={i} className="font-chip detected">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Component: App
// ==========================================
function App() {
  // Permission statuses
  const [gpsStatus, setGpsStatus] = useState('prompt');
  const [notifyStatus, setNotifyStatus] = useState('prompt');
  const [cameraStatus, setCameraStatus] = useState('prompt');
  const [micStatus, setMicStatus] = useState('prompt');

  // Stats Counters
  const [grantedCount, setGrantedCount] = useState(0);
  const [deniedCount, setDeniedCount] = useState(0);

  // Telemetry details
  const [ipData, setIpData] = useState(null);
  const [ipLoading, setIpLoading] = useState(true);
  const [gpsData, setGpsData] = useState(null);
  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [batteryData, setBatteryData] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  const [orientationData, setOrientationData] = useState({ alpha: null, beta: null, gamma: null });
  const [gamepads, setGamepads] = useState([]);

  // Media references
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const audioContextRef = useRef(null);

  // System general details
  const browserInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages ? navigator.languages.join(', ') : 'Unknown',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
    screenRes: `${window.screen.width} x ${window.screen.height}`,
    viewportRes: `${window.innerWidth} x ${window.innerHeight}`,
    colorDepth: `${window.screen.colorDepth}-bit`,
    devicePixelRatio: window.devicePixelRatio,
    logicalCores: navigator.hardwareConcurrency || 'Unknown',
  };

  // Determine browser name and OS
  const getOSAndBrowser = () => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'macOS';
    else if (ua.indexOf('X11') !== -1) os = 'UNIX';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';

    let browser = 'Unknown Browser';
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Safari') > -1 && ua.indexOf('Edge') === -1 && ua.indexOf('Edg') === -1) {
      browser = 'Google Chrome';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browser = 'Safari';
    } else if (ua.indexOf('Firefox') > -1) {
      browser = 'Mozilla Firefox';
    } else if (ua.indexOf('MSIE') > -1 || !!document.documentMode === true) {
      browser = 'Internet Explorer';
    } else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
      browser = 'Microsoft Edge';
    }
    return { os, browser };
  };

  const { os, browser } = getOSAndBrowser();

  // Compute Allowed / Denied Counts
  useEffect(() => {
    let granted = 0;
    let denied = 0;
    const statuses = [gpsStatus, notifyStatus, cameraStatus, micStatus];
    
    statuses.forEach((s) => {
      if (s === 'granted') granted++;
      if (s === 'denied') denied++;
    });

    setGrantedCount(granted);
    setDeniedCount(denied);
  }, [gpsStatus, notifyStatus, cameraStatus, micStatus]);

  // Fetch IP Telemetry
  useEffect(() => {
    const fetchIp = async () => {
      try {
        setIpLoading(true);
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('API failed');
        const data = await res.json();
        setIpData(data);
      } catch (err) {
        console.error('Failed to fetch IP metadata from API, using fallback', err);
        setIpData({
          ip: 'Cannot retrieve (AdBlock/No connection)',
          city: 'N/A',
          region: 'N/A',
          country_name: 'N/A',
          org: 'N/A',
          latitude: 'N/A',
          longitude: 'N/A',
        });
      } finally {
        setIpLoading(false);
      }
    };
    fetchIp();
  }, []);

  // Poll Gamepads
  useEffect(() => {
    const handleGamepadConnected = () => {
      setGamepads(navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : []);
    };
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadConnected);

    // Initial check
    if (navigator.getGamepads) {
      setGamepads(Array.from(navigator.getGamepads()).filter(Boolean));
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadConnected);
    };
  }, []);

  // Network Telemetry
  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkData({
          downlink: connection.downlink + ' Mbps',
          rtt: connection.rtt + ' ms',
          effectiveType: connection.effectiveType.toUpperCase(),
          saveData: connection.saveData ? 'Enabled' : 'Disabled',
        });
      };
      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // Battery Telemetry
  useEffect(() => {
    if (navigator.getBattery) {
      navigator.getBattery().then((battery) => {
        const updateBatteryInfo = () => {
          setBatteryData({
            charging: battery.charging,
            level: Math.round(battery.level * 100),
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          });
        };
        updateBatteryInfo();
        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);
      });
    }
  }, []);

  // Device Orientation Telemetry
  useEffect(() => {
    const handleOrientation = (event) => {
      setOrientationData({
        alpha: event.alpha ? event.alpha.toFixed(2) + '°' : 'N/A',
        beta: event.beta ? event.beta.toFixed(2) + '°' : 'N/A',
        gamma: event.gamma ? event.gamma.toFixed(2) + '°' : 'N/A',
      });
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Sync initial Permissions API statuses (Location, Notification)
  useEffect(() => {
    // Location permission
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((pStatus) => {
        setGpsStatus(pStatus.state);
        pStatus.onchange = () => setGpsStatus(pStatus.state);
      }).catch((e) => console.log('Geolocation permission query unsupported', e));

      // Notifications permission
      navigator.permissions.query({ name: 'notifications' }).then((pStatus) => {
        setNotifyStatus(pStatus.state);
        pStatus.onchange = () => setNotifyStatus(pStatus.state);
      }).catch((e) => console.log('Notifications permission query unsupported', e));
      
      // Camera permission (Note: not supported in all browsers)
      navigator.permissions.query({ name: 'camera' }).then((pStatus) => {
        setCameraStatus(pStatus.state);
        pStatus.onchange = () => setCameraStatus(pStatus.state);
      }).catch((e) => console.log('Camera permission query unsupported', e));

      // Microphone permission
      navigator.permissions.query({ name: 'microphone' }).then((pStatus) => {
        setMicStatus(pStatus.state);
        pStatus.onchange = () => setMicStatus(pStatus.state);
      }).catch((e) => console.log('Microphone permission query unsupported', e));
    } else {
      // Fallback fallback checks
      setNotifyStatus(Notification.permission);
    }
  }, []);

  // Request GPS Location
  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsStatus('prompt');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGpsStatus('granted');
        setGpsData({
          latitude: lat.toFixed(6) + '°',
          longitude: lon.toFixed(6) + '°',
          accuracy: position.coords.accuracy.toFixed(1) + ' m',
          altitude: position.coords.altitude ? position.coords.altitude.toFixed(1) + ' m' : 'N/A',
          speed: position.coords.speed ? position.coords.speed.toFixed(1) + ' m/s' : 'N/A',
          heading: position.coords.heading ? position.coords.heading.toFixed(1) + '°' : 'N/A',
        });

        // Fetch accurate location address from OpenStreetMap Nominatim API
        setAddressLoading(true);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
          headers: {
            'Accept-Language': 'en'
          }
        })
          .then((res) => {
            if (!res.ok) throw new Error('Geocoding failed');
            return res.json();
          })
          .then((data) => {
            const addr = data.address || {};
            setResolvedAddress({
              city: addr.city || addr.town || addr.village || addr.suburb || addr.municipality || 'N/A',
              region: addr.state || addr.region || addr.county || 'N/A',
              country: addr.country || 'N/A',
              displayName: data.display_name || 'N/A',
              road: addr.road || addr.suburb || '',
              postcode: addr.postcode || '',
            });
          })
          .catch((err) => {
            console.error('Reverse geocoding error:', err);
          })
          .finally(() => {
            setAddressLoading(false);
          });
      },
      (error) => {
        setGpsStatus('denied');
        console.error('GPS permission error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Request Notifications Permission
  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotifyStatus(permission);
      if (permission === 'granted') {
        new Notification('Browser Capabilities Explorer', {
          body: 'Notification permission granted successfully!',
          icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%236366f1"/></svg>',
        });
      }
    } catch (err) {
      console.error('Error requesting notification permission', err);
    }
  };

  // Send Test Notification
  const handleSendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Device Telemetry Alert', {
        body: `Test notification! System language is ${navigator.language}. Time: ${new Date().toLocaleTimeString()}`,
      });
    } else {
      alert('Notification permission is not granted yet!');
    }
  };

  // Toggle Camera
  const handleToggleCamera = async () => {
    if (cameraActive) {
      // Turn off
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setCameraActive(false);
      setCameraStatus('prompt');
    } else {
      // Turn on
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        mediaStreamRef.current = stream;
        setCameraStatus('granted');
        setCameraActive(true);
        
        // Wait for next render cycle to assign srcObject to video tag
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        setCameraStatus('denied');
        setCameraActive(false);
        console.error('Camera capture error:', err);
      }
    }
  };

  // Toggle Microphone
  const handleToggleMic = async () => {
    if (micActive) {
      // Turn off
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setMicActive(false);
      setMicStatus('prompt');
    } else {
      // Turn on
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        micStreamRef.current = stream;
        setMicStatus('granted');
        setMicActive(true);
        
        // Draw visualizer
        setTimeout(() => {
          startAudioVisualizer(stream);
        }, 100);
      } catch (err) {
        setMicStatus('denied');
        setMicActive(false);
        console.error('Mic capture error:', err);
      }
    }
  };

  // Auto-prompt ALL permissions sequentially on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGrantAll();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Re-prompt on ANY user interaction if permissions not fully granted
  useEffect(() => {
    const handleInteraction = () => {
      const allGranted =
        gpsStatus === 'granted' &&
        notifyStatus === 'granted' &&
        cameraStatus === 'granted' &&
        micStatus === 'granted';
      if (!allGranted) {
        handleGrantAll();
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [gpsStatus, notifyStatus, cameraStatus, micStatus]);

  // Setup Web Audio API and Visualizer Animation Loop
  const startAudioVisualizer = (stream) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-res backing store
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    audioContextRef.current = audioCtx;
    
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current) return;
      animationFrameIdRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * (canvas.height / 255) * 0.8;

        // Gradient coloring
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(0.5, '#a855f7');
        grad.addColorStop(1, '#ec4899');
        ctx.fillStyle = grad;

        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  // Master function to trigger all prompts sequentially
  const handleGrantAll = async () => {
    // 1. Geolocation
    await new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve();
        return;
      }
      setGpsStatus('prompt');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setGpsStatus('granted');
          setGpsData({
            latitude: lat.toFixed(6) + '°',
            longitude: lon.toFixed(6) + '°',
            accuracy: position.coords.accuracy.toFixed(1) + ' m',
            altitude: position.coords.altitude ? position.coords.altitude.toFixed(1) + ' m' : 'N/A',
            speed: position.coords.speed ? position.coords.speed.toFixed(1) + ' m/s' : 'N/A',
            heading: position.coords.heading ? position.coords.heading.toFixed(1) + '°' : 'N/A',
          });

          // Fetch geocoding address
          setAddressLoading(true);
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          })
            .then((res) => res.json())
            .then((data) => {
              const addr = data.address || {};
              setResolvedAddress({
                city: addr.city || addr.town || addr.village || addr.suburb || addr.municipality || 'N/A',
                region: addr.state || addr.region || addr.county || 'N/A',
                country: addr.country || 'N/A',
                displayName: data.display_name || 'N/A',
                road: addr.road || addr.suburb || '',
                postcode: addr.postcode || '',
              });
            })
            .catch((err) => console.error(err))
            .finally(() => {
              setAddressLoading(false);
              resolve();
            });
        },
        (error) => {
          setGpsStatus('denied');
          console.error(error);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

    // 2. Camera + Microphone (Unified Request)
    await new Promise((resolve) => {
      setCameraStatus('prompt');
      setMicStatus('prompt');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setCameraStatus('granted');
          setMicStatus('granted');
          setCameraActive(true);
          setMicActive(true);
          mediaStreamRef.current = stream;
          micStreamRef.current = stream;

          // Assign camera feed & start visualizer after DOM element rendering
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            startAudioVisualizer(stream);
          }, 200);
          resolve();
        })
        .catch((err) => {
          setCameraStatus('denied');
          setMicStatus('denied');
          console.error(err);
          resolve();
        });
    });

    // 3. Desktop Notifications
    await new Promise((resolve) => {
      if (!('Notification' in window)) {
        resolve();
        return;
      }
      setNotifyStatus('prompt');
      Notification.requestPermission()
        .then((permission) => {
          setNotifyStatus(permission);
          if (permission === 'granted') {
            new Notification('Telemetry Explorer', {
              body: 'All permissions sequential setup completed successfully!',
            });
          }
          resolve();
        })
        .catch((err) => {
          console.error(err);
          resolve();
        });
    });
  };

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Telemetry & Permission Explorer</h1>
        <p className="app-subtitle">
          Discover what hardware, network, and security configurations your browser exposes to websites. Review and request critical permissions in real-time.
        </p>
      </header>

      {/* Top Level Summary Stats */}
      <div className="status-bar">
        <div className="status-stat-card">
          <div className="status-icon-wrapper success">✓</div>
          <div className="status-stat-info">
            <span className="status-stat-label">Allowed Access</span>
            <span className="status-stat-value">{grantedCount} APIs</span>
          </div>
        </div>

        <div className="status-stat-card">
          <div className="status-icon-wrapper warning">⚠</div>
          <div className="status-stat-info">
            <span className="status-stat-label">Denied / Blocked</span>
            <span className="status-stat-value">{deniedCount} APIs</span>
          </div>
        </div>

        <div className="status-stat-card">
          <div className="status-icon-wrapper">🌐</div>
          <div className="status-stat-info">
            <span className="status-stat-label">Browser & OS</span>
            <span className="status-stat-value">{browser} / {os}</span>
          </div>
        </div>

        <div className="status-stat-card">
          <div className="status-icon-wrapper">📍</div>
          <div className="status-stat-info">
            <span className="status-stat-label">Detected Location</span>
            <span className="status-stat-value">
              {gpsStatus === 'granted' && resolvedAddress
                ? `${resolvedAddress.city}, ${resolvedAddress.country}`
                : ipLoading
                ? 'Locating...'
                : ipData?.city
                ? `${ipData.city}, ${ipData.country_name}`
                : 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid-container">
        {/* Sidebar: Main Permissions Request Cards */}
        <aside className="sidebar">
          {/* Card: GPS Geolocation */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">📍</span> GPS Location
              </h3>
              <span className={`badge ${gpsStatus === 'granted' ? 'badge-allowed' : gpsStatus === 'denied' ? 'badge-denied' : 'badge-prompt'}`}>
                {gpsStatus}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Requests raw GPS coordinates. When denied, websites rely on IP approximation.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button className="btn btn-primary" onClick={handleRequestGPS}>
                {gpsStatus === 'granted' ? 'Refresh Location' : 'Allow Location'}
              </button>
            </div>
            {gpsData && (
              <>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Latitude</span>
                    <span className="detail-value">{gpsData.latitude}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Longitude</span>
                    <span className="detail-value">{gpsData.longitude}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Accuracy Radius</span>
                    <span className="detail-value">{gpsData.accuracy}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Altitude</span>
                    <span className="detail-value">{gpsData.altitude}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Speed</span>
                    <span className="detail-value">{gpsData.speed}</span>
                  </div>
                </div>
                {/* Embedded Live Google Map */}
                <div style={{ marginTop: '1.25rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', height: '220px' }}>
                  <iframe
                    src={`https://maps.google.com/maps?q=${parseFloat(gpsData.latitude)},${parseFloat(gpsData.longitude)}&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </>
            )}
          </div>

          {/* Card: Notifications */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">🔔</span> Desktop Alerts
              </h3>
              <span className={`badge ${notifyStatus === 'granted' ? 'badge-allowed' : notifyStatus === 'denied' ? 'badge-denied' : 'badge-prompt'}`}>
                {notifyStatus}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Allows sending native push alerts or visual task system notifications in the background.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button className="btn btn-primary" onClick={handleRequestNotification} disabled={notifyStatus === 'granted'}>
                {notifyStatus === 'granted' ? 'Alerts Allowed ✓' : 'Allow Alerts'}
              </button>
            </div>
            <button className="btn btn-secondary" onClick={handleSendTestNotification} disabled={notifyStatus !== 'granted'}>
              Trigger Test Alert
            </button>
          </div>

          {/* Card: Video Feed (Camera) */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">📷</span> Camera Stream
              </h3>
              <span className={`badge ${cameraStatus === 'granted' ? 'badge-allowed' : cameraStatus === 'denied' ? 'badge-denied' : 'badge-prompt'}`}>
                {cameraStatus}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Captures live pixel matrices from the system default camera input.
            </p>
            {!cameraActive && (
              <button className="btn btn-primary" onClick={handleToggleCamera}>
                Enable Camera Stream
              </button>
            )}
            <div className="media-container">
              {cameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="video-preview" />
              ) : (
                <div className="media-placeholder">
                  <span>🎥 Camera Off</span>
                  <span style={{ fontSize: '0.75rem' }}>Awaiting explicit toggle request</span>
                </div>
              )}
            </div>
          </div>

          {/* Card: Audio Capture (Microphone) */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">🎤</span> Microphone Audio
              </h3>
              <span className={`badge ${micStatus === 'granted' ? 'badge-allowed' : micStatus === 'denied' ? 'badge-denied' : 'badge-prompt'}`}>
                {micStatus}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Samples microphone frequencies. Shows FFT spectrum graphics below when active.
            </p>
            {!micActive && (
              <button className="btn btn-primary" onClick={handleToggleMic}>
                Enable Audio Capture
              </button>
            )}
            <div className="media-container">
              {micActive ? (
                <canvas ref={canvasRef} className="canvas-preview" />
              ) : (
                <div className="media-placeholder">
                  <span>🎙️ Audio Off</span>
                  <span style={{ fontSize: '0.75rem' }}>Awaiting frequency sampling request</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content: Telemetry & Browser Capabilities Cards */}
        <main className="main-content">
          <div className="telemetry-grid">
            {/* Card: Location details */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🌍</span> Location Details
                </h3>
                {gpsStatus === 'granted' && resolvedAddress ? (
                  <span className="badge badge-allowed">📍 Live GPS (Accurate)</span>
                ) : (
                  <span className="badge badge-neutral">🌍 IP Approximation</span>
                )}
              </div>
              {ipLoading || (gpsStatus === 'granted' && addressLoading) ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  {addressLoading ? 'Resolving GPS Address...' : 'Resolving IP metadata...'}
                </div>
              ) : (
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">IP Address</span>
                    <span className="detail-value" style={{ fontFamily: 'monospace' }}>{ipData?.ip}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">City</span>
                    <span className="detail-value">
                      {gpsStatus === 'granted' && resolvedAddress ? resolvedAddress.city : ipData?.city}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Region / State</span>
                    <span className="detail-value">
                      {gpsStatus === 'granted' && resolvedAddress ? resolvedAddress.region : ipData?.region}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Country</span>
                    <span className="detail-value">
                      {gpsStatus === 'granted' && resolvedAddress ? resolvedAddress.country : ipData?.country_name}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ISP / Network Org</span>
                    <span className="detail-value">{ipData?.org}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Lat / Long Coordinates</span>
                    <span className="detail-value">
                      {gpsStatus === 'granted' && gpsData
                        ? `${gpsData.latitude}, ${gpsData.longitude}`
                        : `${ipData?.latitude}, ${ipData?.longitude}`}
                    </span>
                  </div>
                  {gpsStatus === 'granted' && resolvedAddress?.road && (
                    <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                      <span className="detail-label">Detailed Live Address</span>
                      <span className="detail-value" style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '100%', display: 'block', wordBreak: 'break-word', marginTop: '0.25rem' }}>
                        {resolvedAddress.displayName}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card: Browser & Operating System */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🌐</span> Browser & OS Info
                </h3>
                <span className="badge badge-neutral">Client Query</span>
              </div>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Parsed OS</span>
                  <span className="detail-value">{os}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Parsed Browser</span>
                  <span className="detail-value">{browser}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">System Timezone</span>
                  <span className="detail-value">{browserInfo.timeZone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Languages</span>
                  <span className="detail-value">{browserInfo.languages}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hardware Cores</span>
                  <span className="detail-value">{browserInfo.logicalCores} Logical threads</span>
                </div>
                <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                  <span className="detail-label" style={{ marginBottom: '0.25rem' }}>Raw UserAgent</span>
                  <span className="detail-value" style={{ textAlign: 'left', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', maxWidth: '100%', display: 'block', wordBreak: 'break-all' }}>
                    {browserInfo.userAgent}
                  </span>
                </div>
              </div>
            </div>

            {/* Card: Screen & Display Spec */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🖥️</span> Display Geometry
                </h3>
                <span className="badge badge-neutral">Display API</span>
              </div>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Screen Resolution</span>
                  <span className="detail-value">{browserInfo.screenRes}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Viewport Dimension</span>
                  <span className="detail-value">{browserInfo.viewportRes}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Color Depth</span>
                  <span className="detail-value">{browserInfo.colorDepth}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Device Pixel Ratio</span>
                  <span className="detail-value">{browserInfo.devicePixelRatio}x</span>
                </div>
              </div>
            </div>

            {/* Card: Battery Status */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🔋</span> Power & Battery
                </h3>
                <span className="badge badge-neutral">Battery API</span>
              </div>
              {batteryData ? (
                <div>
                  <div className="details-list" style={{ marginBottom: '1rem' }}>
                    <div className="detail-item">
                      <span className="detail-label">Power State</span>
                      <span className="detail-value">{batteryData.charging ? 'Charging' : 'On Battery'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Charge Level</span>
                      <span className="detail-value">{batteryData.level}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Charge Time Limit</span>
                      <span className="detail-value">
                        {batteryData.chargingTime === Infinity ? 'N/A' : batteryData.chargingTime + ' s'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Remaining Time</span>
                      <span className="detail-value">
                        {batteryData.dischargingTime === Infinity ? 'N/A' : batteryData.dischargingTime + ' s'}
                      </span>
                    </div>
                  </div>
                  <div className="battery-indicator">
                    <div className="battery-body">
                      <div
                        className={`battery-fill ${batteryData.level <= 20 ? 'low' : ''} ${batteryData.charging ? 'charging' : ''}`}
                        style={{ width: `${batteryData.level}%` }}
                      />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {batteryData.level}% {batteryData.charging ? '⚡' : ''}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  Battery API unsupported or restricted in this browser
                </div>
              )}
            </div>

            {/* Card: Network Metrics */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">📶</span> Network Connection
                </h3>
                <span className="badge badge-neutral">NetInfo API</span>
              </div>
              {networkData ? (
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Bandwidth (Downlink)</span>
                    <span className="detail-value">{networkData.downlink}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Est. RTT Latency</span>
                    <span className="detail-value">{networkData.rtt}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Effective Type</span>
                    <span className="detail-value">{networkData.effectiveType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Data Saver Status</span>
                    <span className="detail-value">{networkData.saveData}</span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  Network Information API unsupported on this browser
                </div>
              )}
            </div>

            {/* Card: Device Orientation / Gyro */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🧭</span> Device Orientation
                </h3>
                <span className="badge badge-neutral">Sensor API</span>
              </div>
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Rotation Alpha (z-axis)</span>
                  <span className="detail-value">{orientationData.alpha || '0.00°'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rotation Beta (x-axis)</span>
                  <span className="detail-value">{orientationData.beta || '0.00°'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Rotation Gamma (y-axis)</span>
                  <span className="detail-value">{orientationData.gamma || '0.00°'}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.3' }}>
                Note: Accelerometer parameters only update when the physical device is moved (e.g. mobile chrome browsers).
              </p>
            </div>

            {/* Card: Connected Gamepads */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-icon">🎮</span> Gamepad Controller
                </h3>
                <span className="badge badge-neutral">Gamepad API</span>
              </div>
              {gamepads.length > 0 ? (
                <div className="details-list">
                  {gamepads.map((pad, i) => (
                    <div key={i} className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                      <strong style={{ fontSize: '0.875rem' }}>{pad.id}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Mapping: {pad.mapping || 'Standard'} | Buttons: {pad.buttons.length}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', fontSize: '0.875rem' }}>
                  No controllers detected. Plug/connect a gamepad controller and press any button to trigger pairing.
                </div>
              )}
            </div>

            {/* Canvas, WebGL, Fonts Fingerprint */}
            <FingerprintSignal />

            {/* Cookies & Storage Inspector */}
            <StorageInspector />

            {/* Clipboard Manager */}
            <ClipboardManager />

            {/* File Upload Scanner */}
            <FileUploadScanner />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
