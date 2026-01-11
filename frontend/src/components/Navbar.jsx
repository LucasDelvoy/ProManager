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

            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <div className="text-xl font-bold text-blue-600">
                            ProManager
                    </div>
                    <ul className="flex items-center gap-10">
                        <li>
                            <Link to='/Dashboard' className="text-gray-600 hover:text-blue-500">Dashboard</Link>
                        </li>
                        <li>
                            <Link to='/Clients' className="text-gray-600 hover:text-blue-500">Clients</Link>
                        </li>
                        <li>
                            <Link to='/Projects' className="text-gray-600 hover:text-blue-500">Projects</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="text-gray-600 hover:text-blue-500">Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )

}

export default Navbar;