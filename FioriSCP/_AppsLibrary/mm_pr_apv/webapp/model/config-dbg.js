/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.requisition.approve.model.Config");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
jQuery.sap.require("sap.ui.core.util.MockServer");

ui.s2p.mm.requisition.approve.model.Config = {};

(function () {
	
	/*global jQuery, sap */
    // The "responder" URL parameter defines if the app shall run with mock data
    var responderOn = jQuery.sap.getUriParameters().get("responderOn");
//    var responderOn = jQuery.sap.getUriParameters().get("OwnMock");
    // set the flag for later usage
//    ui.s2p.mm.requisition.approve.model.Config.isMock = ("true" === responderOn);
    ui.s2p.mm.requisition.approve.model.Config.isMock = ("true" === responderOn);
    
    ui.s2p.mm.requisition.approve.model.Config.setMockResponses = function(){
      var app = sap.ca.scfld.md.app.Application.getImpl();
      var oMockServer = app.oConnectionManager.mockServerList.GBAPP_PRAPPROVAL;
      var aMyRequests = [];
      var oItemDetailMockObject = {
    			  __metadata: {
    			  id: "",
    			  uri: "",
    			  type: "GBAPP_PRAPPROVAL.HeaderItemDetail"
    			  },
    			  HdItmProductDetails: {
    			  __metadata: {
    			  type: "GBAPP_PRAPPROVAL.HdItmProductDetails"
    			  },
    			  ItemType: "M",
    			  MaterialID: "",
    			  MaterialGroupDescription: "Metal processing",
    			  MaterialGroup: "001"
    			  },
    			  HdItmDeliveryAddress: {
    			  __metadata: {
    			  type: "GBAPP_PRAPPROVAL.HdItmDeliveryAddress"
    			  },
    			  Plant: "0001",
    			  PlantName: "eCATT plant",
    			  CustomerId: "",
    			  CustomerName: "",
    			  AddressString: "Neurottstrass 16 54, 69190 Walldorf, Germany"
    			  },
    			  SAP__Origin: "Q5K_004",
    			  WorkitemID: "000003124044",
    			  PrNumber: "10132053",
    			  ItemNumber: "00010",
    			  PrNumberFormatted: "10132053",
    			  ItemNumberFormatted: "10",
    			  ItemCategory: "0",
    			  ItemCategoryDescription: "Standard",
    			  Description: "test",
    			  TaskType: "",
    			  WiCreatedAt: null,
    			  ForwardedByID: "",
    			  ForwardedByName: "",
    			  SubstitutingForID: "",
    			  SubstitutingForName: "",
    			  Unit: "BX",
    			  UnitDescription: "Box",
    			  Quantity: "5000",
    			  Value: "10000.00",
    			  Currency: "EUR",
    			  PricePerUnit: "2.00",
    			  CurrencyForPPU: "EUR",
    			  QuantityForPPU: "1",
    			  UnitForPPU: "BX",
    			  UnitForPPUDescription: "Box",
    			  CreatedByID: "WOLFMAR",
    			  CreatedByName: "Markus du Wolf",
    			  DeliveryDate: "/Date(1410480000000)/",
    			  DeliveryDateAlsoLater: "",
    			  NumberOfNotes: 0,
    			  NumberOfAttachments: 1,
    			  NumberServiceLines: 0,
    			  SupplierID: "",
    			  SupplierName: "",
    			  ServiceLines: {
    			  results: [ ]
    			  },
    			  Limits: {
    			  results: [ ]
    			  },
    			  Accountings: {
    			  results: [
    			  {
    			  __metadata: {
    			  id: "test",
    			  uri: "test",
    			  type: "GBAPP_PRAPPROVAL.Accounting"
    			  },
    			  SAP__Origin: "Q5K_004",
    			  PrNumber: "10132053",
    			  ItemNumber: "00010",
    			  AccountLineNumber: "0000000000000000000000",
    			  ServiceLineNumber: "0000000000",
    			  AccountCategory: "U",
    			  AccountCategoryDescription: "Unknown",
    			  AccountNumber: "",
    			  AccountDescription: "Unknown",
    			  DistributionPercentage: "",
    			  GlAccountNumber: "Unknown",
    			  GlAccountDescription: "",
    			  CostCentre: "",
    			  CostCentreIndicator: "",
    			  CostCentreDescription: "",
    			  WBSElement: "",
    			  WBSElementIndicator: "",
    			  WBSElementDescription: "",
    			  Network: "",
    			  NetworkIndicator: "",
    			  NetworkDescription: "",
    			  Order: "",
    			  OrderIndicator: "",
    			  OrderDescription: "",
    			  SalesOrder: "",
    			  SalesOrderItem: "0",
    			  SalesOrderScheduleLine: "0",
    			  SalesOrderIndicator: "",
    			  SalesOrderDescription: "",
    			  Asset: "",
    			  AssetSubNumber: "",
    			  AssetIndicator: "",
    			  AssetDescription: "",
    			  ProfitCenter: "",
    			  ProfitCenterDescription: ""
    			  }
    			  ]
    			  },
    			  Notes: {
    			  results: [ ]
    			  },
    			  Attachments: {
    			  results: [
    			  {
    			  __metadata: {
    			  id: "test",
    			  uri: "test",
    			  type: "GBAPP_PRAPPROVAL.Attachment",
    			  content_type: "application/octet-stream",
    			  media_src: "test",
    			  edit_media: "test"
    			  },
    			  SAP__Origin: "Q5K_004",
    			  AttachmentGuid: "FA163E2D31DE1ED493D7AB5FFADA79D7",
    			  PrNumber: "0010132053",
    			  ItemNumber: "00010",
    			  Description: "Test",
    			  FileName: "Test.docx",
    			  MimeType: "application/octet-stream",
    			  FileSize: "12873",
    			  CreatedByID: "WOLFMAR",
    			  CreatedByName: "Markus du Wolf",
    			  CreatedAt: "/Date(1412726400000)/"
    			  }
    			  ]
    			  },
    			  Components: {
    			  __deferred: {
    			  uri: "test"
    			  }
    			  }
      };
      aMyRequests.push({
          method: "POST",
          path: new RegExp(".*ApplyDecision.*"), 
          response: function(oXhr, sUrlParams) {
              jQuery.sap.log.debug("Fake Request for Approval Button");
              oXhr.respondJSON(200, {}, JSON.stringify({
                  d: {
                	  ApplyDecision: {
                    	  ActionSuccessful: "X"
                	  }
                  }
              }));
          }
        },
        {
            method: "GET",
            path: new RegExp(".*HeaderItemDetails.*"), 
            response: function(oXhr, sUrlParams) {
                jQuery.sap.log.debug("Fake Request for Approval Button");
                oXhr.respondJSON(200, {}, JSON.stringify({
                	
                		d: oItemDetailMockObject
                		
                }));
            }}
      );
      
//      var sUri = "sap/opu/odata/sap/GBAPP_POAPPROVAL/";
//      var oMockServer = new sap.ui.core.util.MockServer({
//      	rootUri: sUri
//      });
      oMockServer.stop();
      oMockServer.setRequests(oMockServer.getRequests().concat(aMyRequests));
      oMockServer.start();
      jQuery.sap.log.info("Running the app with mock data");
    };
}
)();