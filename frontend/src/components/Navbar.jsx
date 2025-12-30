import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar () {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    if (!token || location.pathname === '/Login' || location.pathname === '/Register') {
        return null
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/Login')
    }

    return (
        <>
        
            <nav>

                <div className="Logo">
                    <strong>ProManager</strong>
                </div>
                <ul>
                    <li>
                        <Link to='/Dashboard'>Dashboard</Link>
                    </li>
                    <li>
                        <Link to='/Clients'>Clients</Link>
                    </li>
                    <li>
                        <Link to='/Projects'>Projects</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>

            </nav>

        </>
    )

}

export default Navbar;