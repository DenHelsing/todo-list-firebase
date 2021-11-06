import React, {Component} from 'react';

class ItemStatusFilter extends Component{

    buttons = [
        {name : "all", label : "All"},
        {name : "active", label : "Active"},
        {name : "done", label : "Done"}
    ]

    render(){
        const {changeStatus, currFilter} = this.props;
        const buttons = this.buttons.map(
            ({name, label}) => {
                return(
                    <button
                        onClick={() => changeStatus(name)}
                        className={`btn ${(currFilter === name) ?
                                    `btn-info` :
                                    `btn-outline-secondary`}`}
                        key={name}
                    >
                        {label}
                    </button>
                )
            }
        )
        return(
            <div className="btn-group">
                {buttons}
                {/* <button type="button" 
                    className="btn btn-info"
                    onClick={() => changeStatus("all")}
                >
                    All
                </button>
                <button type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => changeStatus("active")}
                >
                    Active
                </button>
                <button type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => changeStatus("done")}
                >
                    Done
                </button> */}
            </div>
        );
    }
}


const ItemStatusFilter1 = () => {
    return(
        <div className="btn-group">
            <button type="button" 
                className="btn btn-info"
            >
                All
            </button>
            <button type="button"
                className="btn btn-outline-secondary">
                Active
            </button>
            <button type="button"
                className="btn btn-outline-secondary">
                Done
            </button>
        </div>
    );
};

export default ItemStatusFilter;