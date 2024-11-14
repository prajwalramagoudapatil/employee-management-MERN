import { Route, Link } from "react-router-dom";


// your route setup
<Route path="/category/:catId" component={Category} / >

// your link creation
const newTo = { 
  pathname: "/category/595212758daa6810cbba4104", 
  param1: "Par1" 
};
// link to the "location"
// see (https://reacttraining.com/react-router/web/api/location)
<Link to={newTo}> </Link>

// In your Category Component, you can access the data like this
function Category(){
  let cat = this.props.match.params.catId // this is 595212758daa6810cbba4104 
  let par1 = this.props.location.param1
  console.log(cat, par1);
}

