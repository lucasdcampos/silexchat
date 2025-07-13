import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import TermsAndPrivacyPage from './pages/TermsAndPrivacy.tsx';

import './index.css';
import BlogPage from './pages/Blog.tsx';
import AboutPage from './pages/About.tsx';
import DevelopersPage from './pages/Developers.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/terms',
    element: <TermsAndPrivacyPage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/developers',
    element: <DevelopersPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);