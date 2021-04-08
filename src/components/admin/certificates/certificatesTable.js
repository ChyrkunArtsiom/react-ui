import {Component} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import "../../../css/admin/admin-certificates-table.css";

class CertificatesTable extends Component {
    render() {
        return (
            <Table stickyHeader className="items-table">
                <TableHead className="admin-certificates-table-header">
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "createDate"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("createDate")}
                            >
                                Created
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "name"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("name")}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            Tags
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "description"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("description")}
                            >
                                Description
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "price"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("price")}
                            >
                                Price
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="items-table-body">
                    {this.props.data.map((item, index) => {
                        let tags = []
                        item.tags.forEach((tag) => tags.push(tag.name));
                        tags = tags.join(", ");
                        return (
                            <TableRow className="admin-certificates-table-tablerow" key={index} onClick={() => this.props.classComponent.props.history.push(`/admin/certificates/${item.id}`)}>
                                <TableCell>{new Date(item.createDate).toLocaleDateString()}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{tags}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>${item.price}</TableCell>
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

export default CertificatesTable;