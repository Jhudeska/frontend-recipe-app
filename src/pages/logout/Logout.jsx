import './Logout.css'
import logout from "../../assets/signin-img.jpg";


function Logout() {
    return (
        <section className=" outer-container logout">
            <div className="inner-container">
                <h1 className="logout__heading">My Recipe</h1>
                <img className="logout__img" src={logout} alt="Image of baking" />
                <p>Logout</p>
            </div>
        </section>
    )
}

export default Logout
