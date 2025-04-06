import React from 'react'
import {useUser} from "./store/User.js"
import logo from './assets/logo.png'
import SiteNavigation from "./components/Routes.jsx"

const App = () => {
    const [isLoading, setIsLoading] = React.useState(true)
    let {checkUser} = useUser()

    React.useEffect(() => {
        const handleCheckUser = async () => {
            if (localStorage.getItem('token'))
                await checkUser()

            setIsLoading(false)
        }

        const timer = setTimeout(handleCheckUser, 2500)
        return () => clearTimeout(timer)
    }, [checkUser])

    if (isLoading) {
        return <div className="loader">
            <img src={logo}
                 alt="loading..."
                 aria-label="Loading image"
            />
        </div>
    }

    return (
        <SiteNavigation/>
    );
};

export default App