import React, {Component} from "react"
import "./item-add-form.css"


export default class ItemAddForm extends Component{

    state = {
        label : "",
        placeholder : "Input a new item",
        txtColor : "grey"
    }

    onLabelChange = (event) => {
        // console.log(".")
        this.setState({
            label : event.target.value
        })
    }

    checkInput = () => {
        const {label} = this.state;
        
    }

    onSubmit = (e) => {
        const {label} =this.state;
        e.preventDefault();
        
        // this.checkInput()
        

        if(label.split(" ").filter((el) => el.length >= 15).length !== 0){
            console.log(label.split(" ").filter((el) => el.length >= 15).length)
            this.setState({
                label : "",
                placeholder : "Incorrect input",
                txtColor: "red"
            }
            , () => {this.makePlaceholdeColorBack()}
            )
        }
        else if(label === ""){
            console.log(label.length)
            this.setState({
                placeholder : "Enter smth!!!",
                txtColor: "red"
            }, () => {this.makePlaceholdeColorBack()})
        }
        // console.log(this.state.txtColor)
        else{
            this.props.onAdding(label);
            this.setState({
                label : "",
                placeholder : "Input a new item",
                txtColor : "grey"              
            })
        }
    }

    makePlaceholdeColorBack = () => {
        setTimeout(() => {this.setState({
            placeholder : "Input a new item",
            txtColor : "grey"  
        })}
        ,
        5000
        )
    }

    render(){
        return(
            <form 
                className="item-add-form"
                onSubmit={this.onSubmit}
                >
                <input
                    type="text"
                    value={this.state.label}
                    className={`form-control ${this.state.txtColor === "red" ? "red" : "grey"}`}
                    onChange={this.onLabelChange}
                    placeholder={this.state.placeholder}
                />
                <button
                    className="btn btn-outline-secondary"
                    title="Add an item"
                >Add an item
                </button>
            </form>

        )
    }
}