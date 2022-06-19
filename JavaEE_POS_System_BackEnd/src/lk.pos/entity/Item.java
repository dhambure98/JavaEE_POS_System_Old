package lk.pos.entity;

/**
 * @ author : Akila Dhambure Liyanage
 * @ since : 0.1.0
 **/

public class Item {

    private String itemCode;
    private String name;
    private int qtyOnHand;
    private double price;

    public Item() {
    }

    public Item(String itemCode, String name, int qtyOnHand, double price) {
        this.itemCode = itemCode;
        this.name = name;
        this.qtyOnHand = qtyOnHand;
        this.price = price;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQtyOnHand() {
        return qtyOnHand;
    }

    public void setQtyOnHand(int qtyOnHand) {
        this.qtyOnHand = qtyOnHand;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}