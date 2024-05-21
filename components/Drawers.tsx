'use client';

import { toggleCart, toggleNav } from '@/lib/features/drawers/drawers_slice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Drawer from '@mui/material/Drawer';
import CartDrawer from './cart_drawer/CartDrawer';
import ProfileNavDrawer from './nav/ProfileNavDrawer';

export default function Drawers() {
  const { navOpen, cartOpen } = useAppSelector((state) => state.drawers);
  const dispatch = useAppDispatch();

  return (
    <>
      <Drawer
        open={cartOpen}
        onClose={() => dispatch(toggleCart(false))}
        anchor="right"
      >
        <CartDrawer />
      </Drawer>
      <Drawer
        open={navOpen}
        onClose={() => dispatch(toggleNav(false))}
        anchor="right"
      >
        <ProfileNavDrawer />
      </Drawer>
    </>
  );
}
