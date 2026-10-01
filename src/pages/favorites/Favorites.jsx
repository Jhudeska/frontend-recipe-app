import './Favorites.css'


function Favorites() {
    return (
        <section className=" outer-container page-container">
            <div className="inner-container">
                <h1 className="page-title">Favorites</h1>

                <table className="data">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Delete</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>
                            <img src="assets/kippensoep.png" alt="Kippensoep" />
                        </td>
                        <td>
                            <strong>Kippensoep</strong>
                        </td>
                        <td>Lorem50</td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img src="assets/kippensoep.png" alt="Kippensoep" />
                        </td>
                        <td>
                            <strong>Kippensoep</strong>
                        </td>
                        <td>Lorem50</td>
                        <td>
                            <button className="mini-btn x">x</button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: "16px" }}>
                    <a href="favorites.html" className="btn btn-primary">
                        Save
                    </a>
                </div>


            </div>

        </section>
    )
}

export default Favorites