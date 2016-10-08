import React from 'react'
import {AppBar} from 'react-toolbox/lib/app_bar'

import style from './Nav.scss'

const Nav = () =>
  <AppBar className={style.appBar} className={style.fixed} fixed>
    Stocks!
  </AppBar>

export default Nav
