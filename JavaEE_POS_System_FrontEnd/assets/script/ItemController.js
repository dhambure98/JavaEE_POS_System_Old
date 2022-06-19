/**
 * @ author : Akila Dhambure Liyanage
 * @ since : 0.1.0
 **/

getAllItem();
bindClickEvent();

/* save item */
function saveItem() {

    let itemOb = {
        "itemCode": $("#txtItemCode").val(),
        "itemName": $("#txtItemName").val(),
        "itemQty": $("#txtItemQty").val(),
        "itemPrice": $("#txtItemPrice").val()
    };

    if ($("#txtItemName").val().length !==0 && $("#txtItemQty").val().length !==0 && $("#txtItemPrice").val().length !==0) {

        $.ajax({
            url:"http://localhost:8080/pos/item",
            method:"POST",
            contentType: "application/json",
            data: JSON.stringify(itemOb),
            success: function (res){
                if (res.status == 200){
                    getAllItem();
                    alert(res.message);

                }else{
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

/* get all item */
function getAllItem() {
    $("#itemToTable").empty();
    $.ajax({
        url:"http://localhost:8080/pos/item?option=GETALL",
        method:"GET",
        success:function (resp){
            for (const item of resp.data){
                let row = `<tr><td>${item.itemCode}</td><td>${item.name}</td><td>${item.qtyOnHand}</td><td>${item.price}</td></tr>`;
                $("#itemToTable").append(row);

            }
            bindClickEvent();

        }
    });
}

function bindClickEvent() {

    $("#itemToTable>tr").click(function () {

        let id = $(this).children().eq(0).text();
        let name = $(this).children().eq(1).text();
        let qtyOnHand = $(this).children().eq(2).text();
        let price = $(this).children().eq(3).text();

        $("#txtItemCode").val(id);
        $("#txtItemName").val(name);
        $("#txtItemQty").val(qtyOnHand);
        $("#txtItemPrice").val(price);

        $("#btnUpdateItem,#btnDeleteItem").attr('disabled', false);

    });
}

/* search item */
$("#btnSearchItem").click(function () {
    let itemCode = $("#txtSearchItemID").val();

    $.ajax({
        url:"http://localhost:8080/pos/item?option=SEARCH&itemCode=" + itemCode,
        method:"GET",
        success:function (resp){

            $("#txtItemCode").val(resp.itemCode);
            $("#txtItemName").val(resp.name);
            $("#txtItemQty").val(resp.qtyOnHand);
            $("#txtItemPrice").val(resp.price);

            $("#btnUpdateItem,#btnDeleteItem").attr('disabled', false);
            $("#lblItemCode,#lblItemName,#lblItemQty,#lblItemPrice").text("");

            bindClickEvent();
        },
        error: function (ob, statusText, error) {
            alert("No Such Customer");
            getAllCustomers();
            clearAll();
        }
    });

});

/* Update a Customer */
$("#btnUpdateItem").click(function () {
    if ($("#txtItemName").val().length !== 0) {
        let itemId = $("#txtItemCode").val();
        let name = $("#txtItemName").val();
        let qty = $("#txtItemQty").val();
        let price = $("#txtItemPrice").val();

        for (let i = 0; i < itemDB.length; i++) {
            if (itemDB[i].getCode() === itemId ) {
                itemDB[i].setDescription(name);
                itemDB[i].setQty(qty);
                itemDB[i].setUnitPrice(price);
            }
        }
        getAllItem();
        clearAll();
        alert("Item was updated!");
        $("#txtSearchItemID").val("");
    } else {
        alert("Select a Item to Update!");
    }
});

/* Remove a Customer */
$("#btnDeleteItem").click(function () {
    if ($("#txtItemName").val().length !== 0) {
        let itemCode = $("#txtItemCode").val();

        let res = confirm("Do you really need to delete this Item..?");
        if (res) {

            $.ajax({
                url: "http://localhost:8080/pos/item?itemCode=" + itemCode,
                method: "DELETE",

                success: function (res) {
                    console.log(res);
                    if (res.status == 200) {
                        alert(res.message);
                        clearAll();
                        getAllItem();
                        $("#txtSearchItemID").val("");
                    } else if (res.status == 400) {
                        alert(res.data);
                    } else {
                        alert(res.data);
                    }

                },
                error: function (ob, status, t) {
                    console.log(ob);
                    console.log(status);
                    console.log(t);
                }
            });

        }

    } else {
        alert("Select a Item to Remove!");
    }
});

function clearAll() {
    $('#txtItemCode,#txtItemName,#txtItemQty,#txtItemPrice').val("");
    $('#txtItemCode,#txtItemName,#txtItemQty,#txtItemPrice').css('border', '2px solid #ced4da');
    // $('#txtCusID,').focus();
    $("#btnSaveItem,#btnUpdateItem,#btnDeleteItem").attr('disabled', true);
    getAllCustomers();
    $("#lblItemCode,#lblItemName,#lblItemQty,#lblItemPrice").text("");
}



/* validation started */

/* Regular expression */
var itemCodeRegEx = /^(I00-)[0-9]{3}$/;
var itemNameRegEx = /^[A-z ]{4,}$/;
var itemUnitPriceRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;
var itemQtyOnHandRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;

$('#txtItemCode,#txtItemName,#txtItemQty,#txtItemPrice').on('keydown', function (eventOb) {
    if (eventOb.key == "Tab") {
        eventOb.preventDefault(); // stop execution of the button
    }
});

$('#txtItemCode,#txtItemName,#txtItemQty,#txtItemPrice').on('blur', function () {
    itemFormValid();
});

/* focusing events */
$("#txtItemCode").on('keyup', function (eventOb) {
    setItemSaveButton();
    if (eventOb.key == "Enter") {
        checkIfValidItem();
    }

});

$("#txtItemName").on('keyup', function (eventOb) {
    setItemSaveButton();
    if (eventOb.key == "Enter") {
        checkIfValidItem();
    }
});

$("#txtItemQty").on('keyup', function (eventOb) {
    setItemSaveButton();
    if (eventOb.key == "Enter") {
        checkIfValidItem();
    }
});

$("#txtItemPrice").on('keyup', function (eventOb) {
    setItemSaveButton();
    if (eventOb.key == "Enter") {
        checkIfValidItem();
    }
});

/* focusing events end */

$("#btnSaveItem").attr('disabled', true);

/* print condition for unvalid input */
function itemFormValid() {
    var cusID = $("#txtItemCode").val();
    $("#txtItemCode").css('border', '1px solid blue');
    $("#lblItemCode").text("");
    if (itemCodeRegEx.test(cusID)) {
        var cusName = $("#txtItemName").val();
        if (itemNameRegEx.test(cusName)) {
            $("#txtItemName").css('border', '1px solid blue');
            $("#lblItemName").text("");
            var cusAddress = $("#txtItemQty").val();
            if (itemUnitPriceRegEx.test(cusAddress)) {
                var cusTp = $("#txtItemPrice").val();
                var resp = itemQtyOnHandRegEx.test(cusTp);
                $("#txtItemQty").css('border', '1px solid blue');
                $("#lblItemQty").text("");
                if (resp) {
                    $("#txtItemPrice").css('border', '1px solid blue');
                    $("#lblItemPrice").text("");
                    return true;
                } else {
                    $("#txtItemPrice").css('border', '2px solid red');
                    $("#lblItemPrice").text("Customer Tp is a required field : Pattern ");
                    return false;
                }
            } else {
                $("#txtItemQty").css('border', '2px solid red');
                $("#lblItemQty").text("Item Qty is a required field : Numbers");
                return false;
            }
        } else {
            $("#txtItemName").css('border', '2px solid red');
            $("#lblItemName").text("Item Name is a required field : Mimimum 3, Max 20, Spaces Allowed");
            return false;
        }
    } else {
        $("#txtItemCode").css('border', '2px solid red');
        $("#lblItemCode").text("Item Code is a required field : Pattern I00-000");
        return false;
    }
}

/* check input value valid  */
function checkIfValidItem() {
    var cusID = $("#txtItemCode").val();
    if (itemCodeRegEx.test(cusID)) {
        $("#txtItemName").focus();
        var cusName = $("#txtItemName").val();
        if (itemNameRegEx.test(cusName)) {
            $("#txtItemQty").focus();
            var cusAddress = $("#txtItemQty").val();
            if (itemUnitPriceRegEx.test(cusAddress)) {
                $("#txtItemPrice").focus();
                var cusTp = $("#txtItemPrice").val();
                var resp = itemQtyOnHandRegEx.test(cusTp);
                if (resp) {
                    let res = confirm("Do you really need to add this Item ..?");
                    if (res) {
                        saveItem();
                        clearAll();
                    }
                } else {
                    $("#txtItemPrice").focus();
                }
            } else {
                $("#txtItemQty").focus();
            }
        } else {
            $("#txtItemName").focus();
        }
    } else {
        $("#txtItemCode").focus();
    }
}

function setItemSaveButton() {
    let b = itemFormValid();
    if (b) {
        $("#btnSaveItem").attr('disabled', false);
    } else {
        $("#btnSaveItem").attr('disabled', true);
    }
}

$('#btnSaveItem').click(function () {
    checkIfValidItem();
});