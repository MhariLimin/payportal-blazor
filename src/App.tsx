import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Applications } from './components/Applications';
import { MerchantProfile } from './components/MerchantProfile';
import { KYCVerification } from './components/KYCVerification';
import { APICredentials } from './components/APICredentials';
import { AdminReview } from './components/AdminReview';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleSelectMerchant = (merchantId: string) => {
    setSelectedMerchantId(merchantId);
    setCurrentPage('profile');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Set a default merchant for pages that need it
    if ((page === 'profile' || page === 'kyc' || page === 'api') && !selectedMerchantId) {
      setSelectedMerchantId('1');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <Applications onSelectMerchant={handleSelectMerchant} />;
      case 'profile':
        return (
          <MerchantProfile
            merchantId={selectedMerchantId || '1'}
            onNavigate={handleNavigate}
          />
        );
      case 'kyc':
        return <KYCVerification merchantId={selectedMerchantId || '1'} />;
      case 'api':
        return <APICredentials merchantId={selectedMerchantId || '1'} />;
      case 'admin':
        return <AdminReview />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
