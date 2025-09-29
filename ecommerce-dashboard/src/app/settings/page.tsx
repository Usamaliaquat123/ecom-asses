'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { LoginForm } from '@/components/forms/LoginForm';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
  X,
  Check,
  Settings,
  Palette,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Trash2,
  Download,
  Upload,
  Key,
  CreditCard,
  Users,
  Building,
  Calendar,
  Clock,
  Languages,
  HelpCircle,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Info,
  MoreVertical,
  UserX,
  Ban
} from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  jobTitle: string;
  company: string;
  department: string;
  location: string;
  timezone: string;
  language: string;
  bio: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
  orderUpdates: boolean;
  inventoryAlerts: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  soundEnabled: boolean;
}

export default function SettingsPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [inviteForm, setInviteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    department: '',
    message: ''
  });

  // Mock user data
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.profile?.firstName || 'John',
    lastName: user?.profile?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/150/150',
    jobTitle: 'Product Manager',
    company: 'Acme Corporation',
    department: 'Product Development',
    location: 'New York, NY',
    timezone: 'America/New_York',
    language: 'English',
    bio: 'Experienced product manager with a passion for creating innovative solutions that drive business growth.'
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordLastChanged: '2024-01-15T10:30:00Z'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    systemAlerts: true,
    orderUpdates: true,
    inventoryAlerts: true
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    soundEnabled: true
  });

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'account', name: 'Account & Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'team', name: 'Team', icon: Users }
  ];

  const handleSave = () => {
    // Save logic here
    setHasChanges(false);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    // Reset form data
  };

  const handleInviteMember = () => {
    // Handle invite logic here
    console.log('Inviting member:', inviteForm);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setShowInviteModal(false);
      setIsClosingModal(false);
      setInviteForm({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        department: '',
        message: ''
      });
    }, 300); // Match the animation duration
  };

  const handleDisableMember = (memberIndex: number) => {
    // Handle disable member logic here
    console.log('Disabling member at index:', memberIndex);
    setOpenDropdown(null);
  };

  const handleRemoveMember = (memberIndex: number) => {
    // Handle remove member logic here
    console.log('Removing member at index:', memberIndex);
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </span>
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {profile.firstName} {profile.lastName}
                      </h2>
                      <p className="text-gray-600 mb-2">{profile.jobTitle} at {profile.company}</p>
                      <p className="text-sm text-gray-500 mb-4">{profile.bio}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {profile.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {profile.timezone}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-black text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => {
                          setProfile({...profile, firstName: e.target.value});
                          setHasChanges(true);
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 py-3  text-black text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => {
                          setProfile({...profile, lastName: e.target.value});
                          setHasChanges(true);
                        }}
                        disabled={!isEditing}
                        className="w-full px-4  text-black text-sm py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => {
                          setProfile({...profile, email: e.target.value});
                          setHasChanges(true);
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 text-black text-sm py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => {
                          setProfile({...profile, phone: e.target.value});
                          setHasChanges(true);
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 text-black text-sm py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        value={profile.jobTitle}
                        onChange={(e) => {
                          setProfile({...profile, jobTitle: e.target.value});
                          setHasChanges(true);
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 text-black text-sm py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => {
                          setProfile({...profile, company: e.target.value});
                          setHasChanges(true);
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 text-black text-sm py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => {
                        setProfile({...profile, bio: e.target.value});
                        setHasChanges(true);
                      }}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 text-black text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Password */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Password & Security</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-4 text-black text-sm py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full text-black text-sm px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full text-black text-sm px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-900">Two-factor authentication is enabled</p>
                        <p className="text-sm text-green-700">Your account is protected with 2FA</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Sessions</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Monitor className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Current Session</p>
                          <p className="text-sm text-gray-500">Chrome on Windows • New York, NY</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Mobile App</p>
                          <p className="text-sm text-gray-500">iPhone • Last active 2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-sm text-red-600 hover:text-red-700">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports' },
                      { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
                      { key: 'orderUpdates', label: 'Order Updates', description: 'Notifications about order status changes' },
                      { key: 'inventoryAlerts', label: 'Inventory Alerts', description: 'Low stock and inventory warnings' },
                      { key: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates and promotional content' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationSettings] as boolean}
                            onChange={(e) => {
                              setNotifications({...notifications, [item.key]: e.target.checked});
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">Browser Notifications</p>
                        <p className="text-sm text-gray-500">Show notifications in your browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => {
                            setNotifications({...notifications, pushNotifications: e.target.checked});
                            setHasChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.smsNotifications}
                          onChange={(e) => {
                            setNotifications({...notifications, smsNotifications: e.target.checked});
                            setHasChanges(true);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                {/* Theme */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => {
                            setAppearance({...appearance, theme: theme.value as any});
                            setHasChanges(true);
                          }}
                          className={`p-4 border-2 rounded-xl transition-colors ${
                            appearance.theme === theme.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                          <p className="font-medium text-gray-900">{theme.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language & Region */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={appearance.language}
                        onChange={(e) => {
                          setAppearance({...appearance, language: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full text-black text-sm px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={appearance.timezone}
                        onChange={(e) => {
                          setAppearance({...appearance, timezone: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full text-black text-sm px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select
                        value={appearance.dateFormat}
                        onChange={(e) => {
                          setAppearance({...appearance, dateFormat: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full text-black text-sm px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select
                        value={appearance.currency}
                        onChange={(e) => {
                          setAppearance({...appearance, currency: e.target.value});
                          setHasChanges(true);
                        }}
                        className="w-full text-black text-sm px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sound */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Sound</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {appearance.soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-gray-400 mr-3" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-gray-400 mr-3" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">Notification Sounds</p>
                        <p className="text-sm text-gray-500">Play sounds for notifications and alerts</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearance.soundEnabled}
                        onChange={(e) => {
                          setAppearance({...appearance, soundEnabled: e.target.checked});
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

       

            {activeTab === 'team' && (
              <div className="space-y-6">
                {/* Team Members */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                     <button 
                       onClick={() => setShowInviteModal(true)}
                       className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                     >
                       Invite Member
                     </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
                      { name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Manager', status: 'Active' },
                      { name: 'Mike Chen', email: 'mike.chen@example.com', role: 'User', status: 'Pending' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mr-4">
                            <span className="text-sm font-semibold text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            {member.role}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.status === 'Active' 
                              ? 'text-green-600 bg-green-50' 
                              : 'text-orange-600 bg-orange-50'
                          }`}>
                            {member.status}
                          </span>
                          <div className="relative">
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openDropdown === index && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <button
                                  onClick={() => handleDisableMember(index)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Ban className="w-4 h-4 mr-3 text-orange-500" />
                                  {member.status === 'Active' ? 'Disable Member' : 'Enable Member'}
                                </button>
                                <button
                                  onClick={() => handleRemoveMember(index)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <UserX className="w-4 h-4 mr-3" />
                                  Remove Member
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
           </div>
         </div>

         {/* Invite Member Modal */}
         {showInviteModal && (
           <div 
             className={`fixed inset-0 bg-opacity-30 flex items-center justify-center p-4 z-50 ${
               isClosingModal ? 'animate-fadeOut' : 'animate-fadeIn'
             }`}
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 handleCloseModal();
               }
             }}
           >
             <div 
               className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide ${
                 isClosingModal ? 'animate-popupOut' : 'animate-popupIn'
               }`}
               onClick={(e) => e.stopPropagation()}
             >
               {/* Modal Header */}
               <div className="flex items-center justify-between p-6 border-b border-gray-100">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900">Invite Team Member</h3>
                   <p className="text-sm text-gray-500 mt-1">Send an invitation to join your team</p>
                 </div>
                 <button
                   onClick={handleCloseModal}
                   className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>

               {/* Modal Body */}
               <div className="p-6 space-y-6">
                 {/* Personal Information */}
                 <div>
                   <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         First Name <span className="text-red-500">*</span>
                       </label>
                       <input
                         type="text"
                         value={inviteForm.firstName}
                         onChange={(e) => setInviteForm({...inviteForm, firstName: e.target.value})}
                         className="w-full px-4 py-3 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                         placeholder="Enter first name"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Last Name <span className="text-red-500">*</span>
                       </label>
                       <input
                         type="text"
                         value={inviteForm.lastName}
                         onChange={(e) => setInviteForm({...inviteForm, lastName: e.target.value})}
                         className="w-full px-4 py-3 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                         placeholder="Enter last name"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Contact Information */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Email Address <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                     <input
                       type="email"
                       value={inviteForm.email}
                       onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                       className="w-full pl-11 pr-4 py-3 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                       placeholder="Enter email address"
                     />
                   </div>
                 </div>

                 {/* Role Selection */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Role <span className="text-red-500">*</span>
                   </label>
                   <div className="space-y-3">
                     {[
                       { 
                         value: 'admin', 
                         label: 'Admin', 
                         description: 'Full access to all features and settings',
                         icon: Shield,
                         color: 'text-red-600 bg-red-50 border-red-200'
                       },
                       { 
                         value: 'manager', 
                         label: 'Manager', 
                         description: 'Can manage team members and view reports',
                         icon: Users,
                         color: 'text-blue-600 bg-blue-50 border-blue-200'
                       },
                       { 
                         value: 'user', 
                         label: 'User', 
                         description: 'Basic access to dashboard and features',
                         icon: User,
                         color: 'text-gray-600 bg-gray-50 border-gray-200'
                       }
                     ].map((role) => {
                       const Icon = role.icon;
                       return (
                         <label
                           key={role.value}
                           className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                             inviteForm.role === role.value
                               ? 'border-purple-500 bg-purple-50'
                               : 'border-gray-200 hover:border-gray-300'
                           }`}
                         >
                           <input
                             type="radio"
                             name="role"
                             value={role.value}
                             checked={inviteForm.role === role.value}
                             onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                             className="sr-only"
                           />
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${role.color}`}>
                             <Icon className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                             <div className="flex items-center justify-between">
                               <h5 className="font-semibold text-gray-900">{role.label}</h5>
                               {inviteForm.role === role.value && (
                                 <CheckCircle className="w-5 h-5 text-purple-600" />
                               )}
                             </div>
                             <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                           </div>
                         </label>
                       );
                     })}
                   </div>
                 </div>

                 {/* Department */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Department
                   </label>
                   <select
                     value={inviteForm.department}
                     onChange={(e) => setInviteForm({...inviteForm, department: e.target.value})}
                     className="w-full px-4 py-3 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                   >
                     <option value="">Select department</option>
                     <option value="marketing">Marketing</option>
                     <option value="sales">Sales</option>
                     <option value="support">Support</option>
                     <option value="hr">Human Resources</option>
                     <option value="finance">Finance</option>
                   </select>
                 </div>

                 {/* Personal Message */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Personal Message (Optional)
                   </label>
                   <textarea
                     value={inviteForm.message}
                     onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                     rows={3}
                     className="w-full px-4 py-3 text-sm text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                     placeholder="Add a personal message to the invitation..."
                   />
                 </div>

                 {/* Invitation Preview */}
                 <div className="bg-gray-50 rounded-lg p-4">
                   <h5 className="text-sm font-semibold text-gray-900 mb-2">Invitation Preview</h5>
                   <div className="text-sm text-gray-600">
                     <p>
                       <strong>{inviteForm.firstName || '[First Name]'} {inviteForm.lastName || '[Last Name]'}</strong> will be invited to join your team as a{' '}
                       <span className="font-medium text-purple-600">
                         {inviteForm.role.charAt(0).toUpperCase() + inviteForm.role.slice(1)}
                       </span>
                       {inviteForm.department && (
                         <span> in the <strong>{inviteForm.department}</strong> department</span>
                       )}.
                     </p>
                     <p className="mt-2">
                       An invitation email will be sent to{' '}
                       <strong>{inviteForm.email || '[email@example.com]'}</strong>
                     </p>
                   </div>
                 </div>
               </div>

               {/* Modal Footer */}
               <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                 <div className="text-sm text-gray-500">
                   <Info className="w-4 h-4 inline mr-1" />
                   The invitation will expire in 7 days
                 </div>
                 <div className="flex items-center space-x-3">
                   <button
                     onClick={handleCloseModal}
                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={handleInviteMember}
                     disabled={!inviteForm.firstName || !inviteForm.lastName || !inviteForm.email}
                     className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Send Invitation
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 }
