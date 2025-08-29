import { Router, Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import Home from '@/pages/Home';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Account from '@/pages/Account';
import Devices from '@/pages/Devices';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/account" component={Account} />
              <Route path="/devices" component={Devices} />
              <Route>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="text-blue-600 hover:text-blue-800">
                      Go back home
                    </a>
                  </div>
                </div>
              </Route>
            </Switch>
          </Router>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;