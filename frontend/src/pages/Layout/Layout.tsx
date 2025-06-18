import { Outlet } from 'react-router';
import { SideMenu } from '../../components/SideMenu/SideMenu';

export const Layout = () => {
  return (
    <div>
      <SideMenu />
      <Outlet />
    </div>
  );
};
