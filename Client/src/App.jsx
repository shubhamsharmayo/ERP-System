import { useState } from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './App.css'
import Dashboard from './pages/dashboard/Dashboard'
import AddStudents from './pages/addStudents/AddStudents'
import StudentDetail from './pages/StudentDetails/StudentDetail'
import EditStudent from './pages/EditStudent/EditStudent'

function App() {


  const router= createBrowserRouter([
    {
      path:"/",
      element:<><Dashboard/></>
    },
    {
      path:'/create',
      element:<><AddStudents/></>
    },{
      path:'/student/:id',
      element:<><StudentDetail /></>
    },{
      path:'/edit/:id',
      element:<><EditStudent/></>
    }
    
  ])
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
