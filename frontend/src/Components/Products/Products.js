import React, { Component } from 'react';
import API from '../../utils/api';
import { Table } from 'reactstrap';

class Product extends Component {
    state = {
        products: []
    }
    
    async componentDidMount() {
        const { data } = await API.get('/product/data');
    
        if (data) {
          this.setState({ products: data.data });
        }
    }

    render() {
        const { products } = this.state;

        return (
            <Table striped>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>MSKU</th>
                    <th>ASIN</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{ p.id }</td>
                            <td>{ p.msku }</td>
                            <td>{ p.asin }</td>
                            <td>{ p.name }</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }
}

export default Product;
