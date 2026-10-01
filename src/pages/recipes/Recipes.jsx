import './Recipes.css'
import soup from "../../assets/kippensoep.png";


function Recipes() {
    return (
        <section className="outer-container page-container">
            <div className="inner-container">
                <h1>My Recipes</h1>

                <table className="data">
                    <thead>
                    <tr className="thead">
                        <th></th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Add</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>
                            <img className="recipes_img" src={soup} alt="Kippensoep" />
                        </td>
                        <td>
                            <strong>Kippensoep</strong>
                        </td>
                        <td>Lorem50</td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img className="recipes_img" src={soup} alt="Kippensoep" />
                        </td>
                        <td>
                            <strong>Kippensoep</strong>
                        </td>
                        <td>Lorem50</td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: "16px" }}>
                    <a href="/" className="btn btn-primary">
                        Save
                    </a>
                </div>


            </div>
        </section>
    )
}

export default Recipes