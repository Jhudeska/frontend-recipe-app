import './Admin.css'
import soup from "../../assets/kippensoep.png";


function Admin() {
    return (
    <section className="outer-container page-container">
        <div className="inner-container">
            <h1>Admin Panel</h1>

            <h1>Users</h1>
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

            <h1>Recipes</h1>
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


            <h1>Categories</h1>
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

            <h1>Ingredients</h1>
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

export default Admin