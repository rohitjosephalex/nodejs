// const XLSX = require('xlsx')
//writing data to an excel sheet about various store data
//Note some of the constants and page details are removed from the code
const Excel = require('exceljs')

const path = require("path");


let workbook = new Excel.Workbook()
let worksheet1 = workbook.addWorksheet('WooCommerce')
let worksheet2 = workbook.addWorksheet('Shopify')
let worksheet3 = workbook.addWorksheet('Amazon')

const folderPath = path.join(__dirname, "../../static/orders-excel")


worksheet1.columns = [
  { header: 'Order ID', key: 'orderid' },
  { header: 'Name', key: 'billing_fname' },
  { header: 'Email', key: 'billing_email' },
  { header: 'Phone', key: 'billing_phone' },
  { header: 'Shipping', key: 'shipping_method' },
  { header: 'Address', key: 'billing_addr1' },
  { header: 'Date', key: 'date_created' },
  { header: 'Status', key: 'status' },
  { header: 'Total', key: 'total' },
  { header: 'Payment Method', key: 'payment_method' },
  { header: 'Payment Details', key: 'payment_method_title' },
  { header: 'Transaction ID', key: 'transaction_id' }
]
worksheet2.columns = worksheet1.columns
worksheet3.columns = [
  { header: 'Order ID', key: 'amz_order_id' },
  { header: 'Name', key: 'billing_fname' },
  { header: 'Email', key: 'billing_email' },
  { header: 'Phone', key: 'billing_phone' },
  { header: 'Shipping', key: 'shipment_status' },
  { header: 'Address', key: 'order_address_dump' },
  { header: 'Date', key: 'purchase_date' },
  { header: 'Status', key: 'order_status' },
  { header: 'Total', key: 'total' },
  { header: 'Payment Method', key: 'payment_method' },
  { header: 'Payment Details', key: '' },
  { header: 'Transaction ID', key: '' }
]

let worksheet4 = workbook.addWorksheet('Flipkart')
worksheet4.columns = [
  { header: 'Order ID', key: 'order_id' },
  { header: 'Shipment ID', key: 'shipment_id' },
  { header: 'Name', key: 'delivery_firstName' },
  { header: 'Email', key: 'billing_email' },
  { header: 'Phone', key: 'delivery_contactNumber' },
  { header: 'Shipment Type', key: 'shipment_type' },
  { header: 'Address', key: 'delivery_addressLine1' },
  { header: 'Dispatch Date', key: 'dispatch_by_date' },
  { header: 'Status', key: 'status' },
  { header: 'Total', key: 'total' },
  { header: 'Payment Method', key: 'payment_method' },
  { header: 'Payment Details', key: 'Payment_details' },
  { header: 'Transaction ID', key: 'Transaction_ID' }
]


const export_data = async (userid, status) => {

  //*WooCommerce*
  worksheet1.columns.forEach(column => {

    column.width = column.header.length < 12 ? 12 : column.header.length
  })//formating row length and height
  worksheet1.getRow(1).font = { bold: true }//making the 1st row(header) as bold


  const WoostoreUrl = await WooCommerce.get_store_url(userid)
  if (WoostoreUrl.data[0] != undefined) {
    var WoostoreUrlData = WoostoreUrl.data[0].store_url

    const Wooorder = await orderData.get_order_data(WoostoreUrlData, status)
    for (let element of Wooorder.data) {
      worksheet1.addRow(element)
      // console.log("THIS order", element)
      worksheet1.addRow({ billing_fname: "Name", billing_email: 'Weight', billing_phone: "Brand", shipping_method: "SKU", billing_addr1: "Quantity", date_created: "Price" })
      let rows = worksheet1.getColumn(1);//used to get count of rows
      let rowsCount = rows['_worksheet']['_rows'].length;//use to get count of rows
      worksheet1.getRow(rowsCount).font = { bold: true }
      var wooList = await orderData.get_woo_list(element.orderid)
      for (let y of wooList.data) {
        worksheet1.addRow({ billing_fname: y.name, billing_email: '', billing_phone: '', shipping_method: y.sku, billing_addr1: y.quantity, date_created: y.price })
        // console.log("Woo List",y)
      }
      worksheet1.addRow('')
      worksheet1.addRow('')
    }
    console.log("WOO END")
  }

  //**WooCommerce****/


  //***Shopify****/
  worksheet2.columns.forEach(column => {
    column.width = column.header.length < 12 ? 12 : column.header.length
  })//formating row length and height
  worksheet2.getRow(1).font = { bold: true }//making the 1st row(header) as bold
  const shopifyStoreUrl = await Shopify.get_store_url(userid)
  if (shopifyStoreUrl.data[0] != undefined) {
    console.log(shopifyStoreUrl.data[0].store_url)
    var shopifyStoreUrlData = shopifyStoreUrl.data[0].store_url
    const shopifyOrder = await orderData.get_shopify_order_data(shopifyStoreUrlData, status)
    // console.log("this***",shopifyOrder.data)
    for (let element of shopifyOrder.data) {
      // console.log("ELEMENT****",element)
      if (status == "completed") {
        worksheet2.addRow(element)
      }
      else {
        element.status = "unfulfilled"
        // console.log("ELEMENT ELSE****",element)
        worksheet2.addRow(element)
      }
      var shopifyList = await orderData.get_shopify_list(element.orderid)
      worksheet2.addRow({ billing_fname: "Name", billing_email: 'Weight', billing_phone: "Brand", shipping_method: "SKU", billing_addr1: "Quantity", date_created: "Price" })
      let rows = worksheet2.getColumn(1);//used to get count of rows
      let rowsCount = rows['_worksheet']['_rows'].length;//use to get count of rows
      worksheet2.getRow(rowsCount).font = { bold: true }
      for (let y of shopifyList.data) {
        worksheet2.addRow({ billing_fname: y.name, billing_email: '', billing_phone: '', shipping_method: y.sku, billing_addr1: y.quantity, date_created: y.price })
        // console.log("shopifyList**",y)
      }
      worksheet2.addRow('')
      worksheet2.addRow('')

    } console.log("SHOPIFY END")
  }
  //***Shopify****/




  //***AMAZON****/
  worksheet3.columns.forEach(column => {
    column.width = column.header.length < 12 ? 12 : column.header.length
  })//formating row length and height
  worksheet3.getRow(1).font = { bold: true }//making the 1st row(header) as bold

  const amazonPartnerId = await Amazon.get_selling_partner_id(userid)
  // console.log("this",amazonPartnerId)
  if (amazonPartnerId.data[0] != undefined) {
    const amazonPartnerData = amazonPartnerId.data[0].selling_partner_id
    const amazonOrder = await orderData.get_amazon_order_data(amazonPartnerData, status)
    // console.log("this***",amazonOrder.data)
    for (let element of amazonOrder.data) {
      worksheet3.addRow(element)
      worksheet3.addRow({ billing_fname: "Name", billing_email: 'Weight', billing_phone: "Brand", shipment_status: "SKU", order_address_dump: "Quantity", purchase_date: "Price" })
      let rows = worksheet3.getColumn(1);//used to get count of rows
      let rowsCount = rows['_worksheet']['_rows'].length;//use to get count of rows
      worksheet3.getRow(rowsCount).font = { bold: true }
      var amazonList = await orderData.get_amazon_list(element.amz_order_id)
      // console.log(amazonList)
      for (let y of amazonList.data) {
        worksheet3.addRow({ billing_fname: y.title, billing_email: 'NULL', billing_phone: 'NULL', shipment_status: y.sku, order_address_dump: y.quantity, purchase_date: y.item_price })
        // console.log("amazonList**", y.sku)
      }
      worksheet3.addRow('')
      worksheet3.addRow('')
    }
    console.log("AMAZON END")
  }
//***AMAZON****/



//***Flipkart****/
 worksheet4.columns.forEach(column => {
    column.width = column.header.length < 12 ? 12 : column.header.length
  })//formating row length and height
  worksheet4.getRow(1).font = { bold: true }//making the 1st row(header) as bold
  const flipkartOrder = await Flipkart.get_orders_query(userid)
  // console.log("THISSSSS",flipkartOrder.data[0])
  if(flipkartOrder.data[0] !=undefined) 
{
  // console.log(flipkartOrder)
  for (let element of flipkartOrder.data) {
    worksheet4.addRow(element)
    worksheet4.addRow({ shipment_id: "Name", billing_email: 'Weight', delivery_contactNumber: "Brand", shipment_type: "SKU", delivery_addressLine1: "Quantity", total: "Total Price", status: "Order Status", dispatch_by_date: "Payment Type" })
    let rows = worksheet4.getColumn(1);//used to get count of rows
    let rowsCount = rows['_worksheet']['_rows'].length;//use to get count of rows
    worksheet4.getRow(rowsCount).font = { bold: true }
    // console.log("SHIPMENTID",element.shipment_id)
    var flipkartList = await orderData.get_flipkart_list(element.shipment_id, status)
    // console.log("list",flipkartList)
    for (let y of flipkartList.data) {
      worksheet4.addRow({ shipment_id: y.title, billing_email: 'NULL', delivery_contactNumber: 'NULL', shipment_type: y.sku, delivery_addressLine1: y.quantity, total: y.total_price, status: y.order_status, dispatch_by_date: y.payment_type })
      // console.log("amazonList**", y)
    }
    worksheet4.addRow('')
    worksheet4.addRow('')
  }
  console.log("FLIPKART END")
}
//***Flipkart****/
  workbook.xlsx.writeFile(folderPath + 'Final_Order_Data.xlsx')
  
}
// export_data(28, "comp")
module.exports = { export_data }
