import React from 'react'
import App from './App.jsx'
import './index.css'
import * as ReactDOM from "react-dom/client";

// const router = createBrowserRouter([
//   {
//     path: '/campaigns/create',
//     element: <CampaignCreation />
//   },
//   {
//     path: '/campaigns/create/success',
//     element: <CampaignCreationSuccess />
//   },
//   {
//     path: '/campaigns/:slug/reports',
//     element: <ReportCreation />
//   },
//   {
//     path: '/reports/create/success',
//     element: <ReportCreationSuccess />
//   },
// ])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
