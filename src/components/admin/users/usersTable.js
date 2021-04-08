import {Component} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from "@material-ui/core";
import "../../../css/admin/admin-users-table.css";

class UsersTable extends Component {
    render() {
        return (
            <Table stickyHeader className="items-table">
                <TableHead className="admin-users-table-header">
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
                                active={this.props.sortBy === "name"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("name")}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "firstName"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("firstName")}
                            >
                                First name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "secondName"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("secondName")}
                            >
                                Second name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={this.props.sortBy === "birthday"}
                                direction={this.props.sortOrder}
                                onClick={() => this.props.requestSort("birthday")}
                            >
                                Birthday
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="items-table-body">
                    {this.props.data.map((item, index) => {
                        return (
                            <TableRow className="admin-users-table-tablerow" key={index} onClick={() => this.props.classComponent.props.history.push(`/admin/users/${item.id}`)}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.firstName}</TableCell>
                                <TableCell>{item.secondName}</TableCell>
                                <TableCell>{new Date(item.birthday).toLocaleDateString()}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        );
    }
}

export default UsersTable;