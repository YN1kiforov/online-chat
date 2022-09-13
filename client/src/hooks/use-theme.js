import { useLayoutEffect, useState } from 'react'


export const useTheme = () => {
	const [theme, setTheme] = useState(
		localStorage.getItem('theme') || "dark"
	)
	useLayoutEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	return { theme, setTheme }
}