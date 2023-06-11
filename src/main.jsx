import React from 'react'
import App from './App.jsx'
import './index.css'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CampaignCreation from './pages/CampaignCreation.jsx';
import CampaignCreationSuccess from './pages/CampaignCreationSuccess.jsx';

const router = createBrowserRouter([
  {
    path: '/campaigns/create',
    element: <CampaignCreation />
  },
  {
    path: '/campaigns/create/success',
    element: <CampaignCreationSuccess />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
