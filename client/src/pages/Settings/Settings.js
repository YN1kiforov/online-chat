
import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../../components/SideMenu'
import { Navigate } from 'react-router-dom'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode'

import s from "./Settings.module.scss"
import { UserId } from '../../redux/slices/auth'
import { useTheme } from '../../hooks/use-theme'

export const Settings = () => {
  const { theme, setTheme } = useTheme()

  const handleLightThemeClick = () => {
    setTheme((prev) => {
      if (prev === "dark") {
        return "light"
      }
      return "dark"
    })
  }

  const userId = useSelector(UserId);

  if (!userId) {
    return <Navigate to="/login" />
  }

  return (
    <div className={s.wrapper}>
      <SideMenu></SideMenu>
      <div className={s.content}>
        <div className={s.settings}>
          <div className={s.title}>Настройки</div>
          <div className={s.list}>
            <div className={s.item}>
              <div>Изменить тему</div>
              <button className='' onClick={handleLightThemeClick}>
                {theme === "dark"
                  ? <LightModeIcon sx={{ fontSize: "30px", color: "white" }} />
                  : <DarkModeIcon sx={{ fontSize: "30px", color: "white" }} />
                }
              </button>
            </div>
            <div className={s.item}></div>
            <div className={s.item}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

