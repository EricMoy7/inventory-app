import React, { Component } from 'react';
import API from '../../utils/api';
import config from '../../config/config';
import { MDBDataTable } from 'mdbreact';

class Product extends Component {
    state = {
        products: []
    }
      
    async componentDidMount() {
        const { data } = await API.get('/product/data');
        
        if (data) {
            this.setState({ 
                products: {
                    columns: config.columns,
                    rows: data.data
                }
            });
        }
    }

    render() {
        const { products } = this.state;

        return (
            <MDBDataTable
                bordered
                small
                noBottomColumns
                hover
                info={false}
                data={products}
            />
        );
    }
}

export default Product;
