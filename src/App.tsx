/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Trainings from './pages/Trainings';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import AdminLayout from './pages/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CollectionManager from './components/admin/CollectionManager';
import SettingsManager from './components/admin/SettingsManager';
import AdminDashboardHome from './components/admin/AdminDashboardHome';
import VideoManager from './components/admin/VideoManager';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { SCHEMAS } from './config/schemas';
import { DEFAULT_SERVICES, DEFAULT_TRAININGS, DEFAULT_PROJECTS } from './config/defaults';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import FashionGallery from './pages/FashionGallery';

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || 
                      location.pathname === '/signin' || 
                      location.pathname === '/signup' || 
                      location.pathname === '/forgot-password';
  
  const isHomePage = location.pathname === '/';
  
  if (isAdminPath) return <>{children}</>;

  return (
    <div className={`text-white selection:bg-pink-500 selection:text-white min-h-screen flex flex-col ${isHomePage ? 'bg-[#1a1a1a]' : 'bg-[#565656]'}`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <PublicLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/collections" element={<FashionGallery />} />
              <Route path="/trainings" element={<Trainings />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/login" element={<Navigate to="/signin" replace />} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardHome />} />
                  <Route path="settings" element={<SettingsManager />} />
                  <Route path="videos" element={<VideoManager />} />
                  {Object.keys(SCHEMAS).map((key) => {
                    if (key === 'settings' || key === 'comments') return null;
                    
                    let defaultItems = undefined;
                    if (key === 'services') defaultItems = DEFAULT_SERVICES;
                    if (key === 'trainings') defaultItems = DEFAULT_TRAININGS;
                    if (key === 'projects') defaultItems = DEFAULT_PROJECTS;

                    return (
                      <Route 
                        key={key}
                        path={key} 
                        element={
                          <CollectionManager 
                            collectionName={key} 
                            title={SCHEMAS[key].title} 
                            fields={SCHEMAS[key].fields} 
                            defaultItems={defaultItems}
                          />
                        } 
                      />
                    );
                  })}
                </Route>
              </Route>
            </Routes>
          </PublicLayout>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
