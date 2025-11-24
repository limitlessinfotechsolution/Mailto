import { useState, useEffect, useCallback } from 'react';
import { FiShield, FiLock, FiEdit3, FiSave, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('security'); // security, signature
  const [loading, setLoading] = useState(false);

  // Password change
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordChanging, setPasswordChanging] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showQR, setShowQR] = useState(false);

  // Signature
  const [signature, setSignature] = useState('');
  const [signatureSaving, setSignatureSaving] = useState(false);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTwoFAEnabled(response.data.twoFactorAuth?.enabled || false);
      setSignature(response.data.signature || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setPasswordChanging(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/2fa/generate', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrCode(response.data.qrCode);
      setBackupCodes(response.data.backupCodes || []);
      setShowQR(true);
    } catch (error) {
      console.error(error);
      alert('Failed to generate 2FA');
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/2fa/verify', {
        code: verifyCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('2FA enabled successfully!');
      setTwoFAEnabled(true);
      setShowQR(false);
      setVerifyCode('');
      loadUserData();
    } catch (error) {
      alert(error.response?.data?.error || 'Invalid code');
    }
  };

  const handleSaveSignature = async () => {
    setSignatureSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/auth/update-signature', {
        signature
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Signature saved successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to save signature');
    } finally {
      setSignatureSaving(false);
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 font-bold text-gray-700 flex items-center gap-2">
          <FiShield className="text-blue-600" /> Settings
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiLock /> Security
          </button>
          <button
            onClick={() => setActiveTab('signature')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'signature' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FiEdit3 /> Email Signature
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
          <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab}</h2>
          <button onClick={loadUserData} className="text-gray-500 hover:text-gray-700" title="Refresh">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'security' && (
            <div className="max-w-3xl space-y-6">
              {/* Password Change */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiLock /> Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passwordChanging}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {passwordChanging ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>

              {/* 2FA */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiShield /> Two-Factor Authentication
                </h3>
                
                {twoFAEnabled ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded">
                    <FiCheck className="text-green-600" size={24} />
                    <div>
                      <div className="font-medium text-green-800">2FA is enabled</div>
                      <div className="text-sm text-green-600">Your account is protected with two-factor authentication</div>
                    </div>
                  </div>
                ) : showQR ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800 mb-3">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                      <div className="bg-white p-4 inline-block rounded">
                        <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                      </div>
                    </div>

                    {backupCodes.length > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-medium text-yellow-800 mb-2">Backup Codes (Save these securely!):</p>
                        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                          {backupCodes.map((code, idx) => (
                            <div key={idx} className="bg-white px-2 py-1 rounded">{code}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleVerify2FA} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter verification code</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          value={verifyCode}
                          onChange={e => setVerifyCode(e.target.value)}
                          placeholder="000000"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                          Verify & Enable
                        </button>
                        <button type="button" onClick={() => setShowQR(false)} className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                    <button
                      onClick={handleEnable2FA}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Enable 2FA
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'signature' && (
            <div className="max-w-3xl">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiEdit3 /> Email Signature
                </h3>
                <p className="text-sm text-gray-600 mb-4">This signature will be automatically appended to all your outgoing emails.</p>
                <textarea
                  className="w-full border border-gray-300 rounded p-3 h-48 focus:ring-2 focus:ring-blue-500 outline-none font-sans"
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  placeholder="Best regards,&#10;Your Name&#10;Your Title&#10;Company Name"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveSignature}
                    disabled={signatureSaving}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiSave /> {signatureSaving ? 'Saving...' : 'Save Signature'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
