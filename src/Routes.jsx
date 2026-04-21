import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import QRCodeScanner from './pages/qr-code-scanner';
import FacultyDashboard from './pages/faculty-dashboard';
import Login from './pages/login';
import StudentDashboard from './pages/student-dashboard';
import StudentAttendanceHistory from './pages/student-attendance-history';
import ClassAttendanceMarking from './pages/class-attendance-marking';
import Events from './pages/events';
import Assignments from './pages/assignments';
import Performance from './pages/performance';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ClassAttendanceMarking />} />
        <Route path="/qr-code-scanner" element={<QRCodeScanner />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-attendance-history" element={<StudentAttendanceHistory />} />
        <Route path="/class-attendance-marking" element={<ClassAttendanceMarking />} />
        <Route path="/events" element={<Events />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
