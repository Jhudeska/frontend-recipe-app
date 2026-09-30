import './NotFound.css'
import notFound from '../../assets/notfound.png'

function NotFound() {
    return (
        <section className=" outer-container not-found">
            <div className="inner-container">
                <h1 className="not-found__heading">My Recipe</h1>
                <img className="not-found__img" src={notFound} alt="Image of baking" />
                <p>404 - Page Not Found</p>
            </div>
        </section>
    )
}

export default NotFound