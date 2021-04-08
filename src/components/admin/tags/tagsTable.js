import {Component} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import "../../../css/admin/admin-tags-table.css";

class TagsTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Table stickyHeader className="items-table">
                <TableHead className="admin-tags-table-header">
                    <TableRow>
                        <TableCell>
                            Id
                        </TableCell>
                        <TableCell>
                            Name
                        </TableCell>
                        <TableCell>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="items-table-body">
                    {this.props.data.map((item, index) => {
                        return (
                            <TableRow className="admin-tags-table-tablerow" key={index}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <div className="items-table-buttons-contaier">
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

export default TagsTable;