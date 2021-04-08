import {Component} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import "../../../css/admin/admin-orders-table.css";

class OrdersTable extends Component {
    render() {
        return (
            <Table stickyHeader className="items-table">
                <TableHead className="admin-orders-table-header">
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "id"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("id")}
                            >
                                Id
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "cost"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("cost")}
                            >
                                Cost
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "purchaseDate"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("purchaseDate")}
                            >
                                Purchase date
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "user.name"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("user.name")}
                            >
                                User
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="items-table-body">
                    {this.props.data.map((item, index) => {
                        return (
                            <TableRow className="admin-orders-table-tablerow" key={index} onClick={() => this.props.classComponent.props.history.push(`/admin/orders/${item.id}`)}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.cost}</TableCell>
                                <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>
                                    <div className="items-table-buttons-contaier">
                                        <button className="edit-button" onClick={event => {
                                            event.stopPropagation();
                                            this.props.onEdit(item);
                                        }}>
                                            Edit
                                        </button>
                                        <button className="delete-button" onClick={event => {
                                            event.stopPropagation();
                                            this.props.onDelete(item);
                                        }}>
                                            Delete
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        );
    }
}

export default OrdersTable;