import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AppNavbar from './components/AppNavbar'
import Home from './components/Home/Home'
import Article from './components/Article'
import Register from './components/auth/Register'
import About from './components/About'
import { ErrorProvider } from './context/ErrorState'
import { AuthProvider } from './context/AuthState'
import { ArticleProvider } from './context/ArticleState'
import { DraftProvider } from './context/DraftState'
import { ValidateProvider } from './context/ValidateState'
import { AlertProvider } from './context/AlertState'
import LoadUser from './components/auth/LoadUser'
import User from './components/user/User'
import Settings from './components/user/Settings'
import UserArticles from './components/user/Articles'
import CreateArticle from './components/user/CreateArticle'
import EditArticle from './components/user/EditArticle'
import Draft from './components/Draft'

function App() {
  return (
    <Router>
      <ErrorProvider>
        <AlertProvider>
          <ValidateProvider>
            <AuthProvider>
              <DraftProvider>
                <ArticleProvider>
                  <LoadUser />
                  <AppNavbar />
                  <Route path="/" component={Home} exact />
                  <Route path="/about" exact component={About} />
                  <Route path="/register" exact component={Register} />
                  <Route path="/article/:title" exact component={Article} />
                  {/* User related components */}
                  <Route path="/user/:id" exact component={User} />
                  <Route path="/user/:id/settings" exact component={Settings} />
                  <Route path="/user/:id/articles" component={UserArticles} />
                  <Route path="/user/articles/edit/:id" component={EditArticle} />
                  <Route path="/user/:id/create-article" component={CreateArticle} />
                  {/* Draft components */}
                  <Route path="/user/drafts/:id" exact component={Draft} />
                </ArticleProvider>
              </DraftProvider>
            </AuthProvider>
          </ValidateProvider>
        </AlertProvider>
      </ErrorProvider>
    </Router>
  );
}

export default App;