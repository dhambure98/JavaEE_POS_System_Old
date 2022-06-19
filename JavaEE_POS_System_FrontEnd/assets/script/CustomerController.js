/**
     * @ author : Akila Dhambure Liyanage
     * @ since : 0.1.0
 **/

getAllCustomers();

/* save customer */
function saveCustomer() {
    let cid = $("#txtCusID").val();
    let name = $("#txtCusName").val();
    let address = $("#txtCusAddress").val();
    let contact = $("#txtCusTp").val();

    let data = $("#customerForm").serialize();

    if (name.length !==0 && address.length !==0 && contact.length !==0) {
        console.log(data);
        $.ajax({
            url: "http://localhost:8080/pos/customer",
            method: "POST",
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status == 200) {
                    getAllCustomers();
                    //loadAllCustomer();
                    alert(res.message);
                } else {
                    console.log(res)
                    alert(res.data);
                }
            },
            error: function (ob, textStatus, error) {
                console.log(ob);
                console.log(textStatus);
                console.log(error);
            }
        });

    } else {
        alert("Fields cannot be empty!");
    }
}

/* get all customer */
function getAllCustomers() {
    $("#customerTable").empty();

    $.ajax({
        url: "http://localhost:8080/pos/customer?option=GETALL",
        method: "GET",

        success: function (resp) {
            for (const customer of resp.data) {
                let row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.contact}</td></tr>`;
                $("#customerTable").append(row);
                console.log(resp);
                console.log(resp.data);
                console.log(customer.id);
            }
        }
    });

}

/* search customer */
$("#btnSearchCustomer").click(function () {

    let searchID = $("#txtSearchCusID").val();
    $("#customerTable").empty();

    $.ajax({
        url: "http://localhost:8080/pos/customer?option=SEARCH&customerID=" + searchID,
        method: "GET",
        success: function (resp) {
            console.log(resp.data);
            $("#txtCusID").val(resp.id);
            $("#txtCusName").val(resp.name);
            $("#txtCusAddress").val(resp.address);
            $("#txtCusTp").val(resp.contact);

            getAllCustomers();
            //bindClickEvents();
        },
        error: function (ob, statusText, error) {
            alert("No Such Customer");
            getAllCustomers();
        }

    });

    $("#btnUpdateCustomer,#btnDeleteCustomer").attr('disabled', false);
});

/* Update a Customer */
$("#btnUpdateCustomer").click(function () {
    if ($("#txtCusName").val().length !== 0) {

        let cusOb = {
            id: $("#txtSearchCusID").val(),
            name: $("#txtCusName").val(),
            address: $("#txtCusAddress").val(),
            contact: $("#txtCusTp").val()
        };
        $.ajax({
            url: "http://localhost:8080/pos/customer",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(cusOb),
            success: function (res) {
                if (res.status == 200) {
                    alert(res.message);
                    getAllCustomers();
                    clearAllCustomerForm();
                    $("#txtSearchCustomer").val("");
                } else if (res.status == 400) {
                    alert(res.message);
                } else {
                    alert(res.data);
                }
            },
            error: function (ob, errorStus) {
                console.log(ob);
                console.log(errorStus);
            }
        });

    } else {
        alert("Select a Customer to Update!");
    }
});

/* Remove a Customer */
$("#btnDeleteCustomer").click(function () {
    if ($("#txtCusName").val().length !== 0) {
        let customerID = $("#txtCusID").val();

        let res = confirm("Do you really need to delete this Customer..?");
        console.log(customerID);
        if (res) {
            $.ajax({
                url: "http://localhost:8080/pos/customer?customerID=" + customerID,
                method: "DELETE",

                success: function (res) {
                    console.log(res);
                    if (res.status == 200) {
                        alert(res.message);
                        clearAllCustomerForm();
                        getAllCustomers();
                        $("#txtSearchCustomer").val("");
                    } else if (res.status == 400) {
                        alert(res.data);
                    } else {
                        alert(res.data);
                    }

                },
                error: function (ob, status, t) {
                    alert(status);
                    console.log(ob);
                    console.log(status);
                    console.log(t);
                }
            });
        }


        // if (res) {
        //
        //     for (let i = 0; i < customerDB.length; i++) {
        //         if (customerDB[i].getCId() === cid ) {
        //             customerDB.splice(i, 1);
        //         }
        //     }
        //     alert("Customer was deleted!");
        //     getAllCustomers();
        //     clearAllCustomerForm();
        //     $("#txtSearchCustomer").val("");
        // }

    } else {
        alert("Select a Customer to Remove!");
    }
});

function clearAllCustomerForm() {
    $('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').val("");
    $('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').css('border', '2px solid #ced4da');
    // $('#txtCusID,').focus();
    $("#btnSaveCustomer,#btnUpdateCustomer,#btnDeleteCustomer").attr('disabled', true);
    getAllCustomers();
    $("#lblCusId,#lblCusName,#lblCusAddress,#lblCusTp").text("");
}



/* validation started */

/* customer regular expressions */
const cusIDRegEx = /^(C00-)[0-9]{1,3}$/;
const cusNameRegEx = /^[A-z ]{5,20}$/;
const cusAddressRegEx = /^[0-9/A-z. ,]{7,}$/;
const cusTpRegEx = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

$('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').on('keydown', function (eventOb) {
    if (eventOb.key == "Tab") {
        eventOb.preventDefault(); // stop execution of the button
    }
});

$('#txtCusID,#txtCusName,#txtCusAddress,#txtCusTp').on('blur', function () {
    formValid();
});

//focusing events
$("#txtCusID").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }

    if (eventOb.key == "Control") {
        var typedCustomerID = $("#txtCusID").val();
        var srcCustomer = searchCustomerFromID(typedCustomerID);
        $("#txtCusID").val(srcCustomer.getCustomerID());
        $("#txtCusName").val(srcCustomer.getCustomerName());
        $("#txtCusAddress").val(srcCustomer.getCustomerAddress());
        $("#txtCusTp").val(srcCustomer.getCustomerTp());
    }
});

$("#txtCusName").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

$("#txtCusAddress").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

$("#txtCusTp").on('keyup', function (eventOb) {
    setButton();
    if (eventOb.key == "Enter") {
        checkIfValid();
    }
});

/* focusing events end */

$("#btnSaveCustomer,#btnUpdateCustomer,#btnDeleteCustomer").attr('disabled', true);

/* print condition for unvalid input */
function formValid() {
    var cusID = $("#txtCusID").val();
    $("#txtCusID").css('border', '1px solid blue');
    $("#lblCusId").text("");
    if (cusIDRegEx.test(cusID)) {
        var cusName = $("#txtCusName").val();
        if (cusNameRegEx.test(cusName)) {
            $("#txtCusName").css('border', '1px solid blue');
            $("#lblCusName").text("");
            var cusAddress = $("#txtCusAddress").val();
            if (cusAddressRegEx.test(cusAddress)) {
                var cusTp = $("#txtCusTp").val();
                var resp = cusTpRegEx.test(cusTp);
                $("#txtCusAddress").css('border', '1px solid blue');
                $("#lblCusAddress").text("");
                if (resp) {
                    $("#txtCusTp").css('border', '1px solid blue');
                    $("#lblCusTp").text("");
                    return true;
                } else {
                    $("#txtCusTp").css('border', '2px solid red');
                    $("#lblCusTp").text("Customer Tp is a required field : Minimum 10 Numbers ");
                    return false;
                }
            } else {
                $("#txtCusAddress").css('border', '2px solid red');
                $("#lblCusAddress").text("Customer Address is a required field : Minimum 7");
                return false;
            }
        } else {
            $("#txtCusName").css('border', '2px solid red');
            $("#lblCusName").text("Customer Name is a required field : Minimum 5, Max 20, Spaces Allowed");
            return false;
        }
    } else {
        $("#txtCusID").css('border', '2px solid red');
        $("#lblCusId").text("Customer ID is a required field : Pattern C00-000");
        return false;
    }
}

function setButton() {
    let b = formValid();
    if (b) {
        $("#btnSaveCustomer").attr('disabled', false);
    } else {
        $("#btnSaveCustomer").attr('disabled', true);
    }
}

/* check input value valid  */
function checkIfValid() {
    var cusID = $("#txtCusID").val();
    if (cusIDRegEx.test(cusID)) {
        $("#txtCusName").focus();
        var cusName = $("#txtCusName").val();
        if (cusNameRegEx.test(cusName)) {
            $("#txtCusAddress").focus();
            var cusAddress = $("#txtCusAddress").val();
            if (cusAddressRegEx.test(cusAddress)) {
                $("#txtCusTp").focus();
                var cusTp = $("#txtCusTp").val();
                var resp = cusTpRegEx.test(cusTp);
                if (resp) {
                    let res = confirm("Do you really need to add this Customer..?");
                    if (res) {
                        saveCustomer();
                        clearAll();
                    }
                } else {
                    $("#txtCusTp").focus();
                }
            } else {
                $("#txtCusAddress").focus();
            }
        } else {
            $("#txtCusName").focus();
        }
    } else {
        $("#txtCusID").focus();
    }
}

$('#btnSaveCustomer').click(function () {
    checkIfValid();
});

/* validation end */

function bindClickEvents() {
    $("#customerTable>tr").click(function () {

        let id = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let address = $(this).children().eq(2).text();
        let contact = $(this).children().eq(3).text();

        $("#txtCusId").val(id);
        $("#txtCusName").val(name);
        $("#txtCusAddress").val(address);
        $("#txtCusContact").val(contact);
    });
}