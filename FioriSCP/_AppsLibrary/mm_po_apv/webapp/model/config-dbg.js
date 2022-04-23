/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("ui.s2p.mm.purchorder.approve.model.Config");
jQuery.sap.require("sap.ca.scfld.md.app.Application");
jQuery.sap.require("sap.ui.core.util.MockServer");

ui.s2p.mm.purchorder.approve.model.Config = {};

(function () {
	
	/*global jQuery, sap */
    // The "responder" URL parameter defines if the app shall run with mock data
    var responderOn = jQuery.sap.getUriParameters().get("responderOn");
//    var responderOn = jQuery.sap.getUriParameters().get("OwnMock");
    // set the flag for later usage
//    ui.s2p.mm.purchorder.approve.model.Config.isMock = ("true" === responderOn);
    ui.s2p.mm.purchorder.approve.model.Config.isMock = ("true" === responderOn);
    
    ui.s2p.mm.purchorder.approve.model.Config.setMockResponses = function(){
      var app = sap.ca.scfld.md.app.Application.getImpl();
      var oMockServer = app.oConnectionManager.mockServerList.GBAPP_POAPPROVAL;
      var aMyRequests = [];
      var oItemDetailMockObject = {
      		__metadata: {
        		id: "",
        		uri: "",
        		type: "GBAPP_POAPPROVAL.ItemDetail"
        		},
        		LimitDetails: {
        		__metadata: {
        		type: "GBAPP_POAPPROVAL.LimitDetails"
        		},
        		LimitDescription: "",
        		IsValueUnLimited: "",
        		ValueLimit: "0.00",
        		ExpectedValue: "0.00",
        		Currency: ""
        		},
        		ProductDetails: {
        		__metadata: {
        		type: "GBAPP_POAPPROVAL.ProductDetails"
        		},
        		ItemType: "M",
        		MaterialID: "APA_MAT",
        		MaterialGroupDescription: "Material group 1",
        		MaterialGroup: "01"
        		},
        		DeliveryAddress: {
        		__metadata: {
        		type: "GBAPP_POAPPROVAL.DeliveryAddress"
        		},
        		Plant: "1000",
        		PlantName: "Werk Hamburg",
        		CustomerId: "",
        		CustomerName: "",
        		AddressString: "Alsterdorfer Strasse 13, 22299 Hamburg-Alsterdorf, Germany"
        		},
        		SAP__Origin: "Q7D_004",
        		ItemNumber: "00010",
        		PoNumber: "PoNumber 2",
        		ItemNumberFormatted: "10",
        		PoNumberFormatted: "PoNumber 2",
        		ItemCategory: "0",
        		ItemCategoryDescription: "Standard",
        		Description: "fiori mat",
        		Blocked: "",
        		Unit: "EA",
        		UnitDescription: "",
        		Quantity: "20",
        		Value: "400.00",
        		Currency: "EUR",
        		PricePerUnit: "20.00",
        		CurrencyForPPU: "EUR",
        		QuantityForPPU: "1",
        		UnitForPPU: "EA",
        		UnitForPPUDescription: "",
        		DeliveryDate: "/Date(1448582400000)/",
        		DeliveryDateAlsoLater: "",
        		Incoterm: "",
        		IncotermDescription: "",
        		IncotermLocation: "",
        		NumberOfNotes: 0,
        		NumberOfAttachments: 0,
        		NumberServiceLines: 0,
        		ServiceLines: {
        		results: [ ]
        		},
        		Limits: {
        		results: [ ]
        		},
        		PricingConditions: {
        		results: [
        		{
        		__metadata: {
        		id: "asd",
        		uri: "sdf",
        		type: "GBAPP_POAPPROVAL.PricingCondition"
        		},
        		SAP__Origin: "Q7D_004",
        		PoNumber: "PoNumber 2",
        		ItemNumber: "00010",
        		PricingConditionType: "PB00",
        		PricingConditionCount: "01",
        		Description: "Gross Price",
        		Value: "20.00",
        		Currency: "EUR"
        		}
        		]
        		},
        		Attachments: {
        		results: [ ]
        		},
        		Notes: {
        		results: [ ]
        		},
        		Accountings: {
        		results: [ ]
        		},
        		Components: {
        		__deferred: {
        		uri: ""
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
        path: new RegExp(".*Item.*"), 
        response: function(oXhr, sUrlParams) {
            jQuery.sap.log.debug("Fake Request for Approval Button");
            oXhr.respondJSON(200, {}, JSON.stringify({
            	
            		d: oItemDetailMockObject
            		
            }));
        }}
        
      );
//      oMockServer.config({
//    	  autoRespond: true
//      });
//      var sUri = "/uis2pmmpurchorderapprove/sap/opu/odata/sap/GBAPP_POAPPROVAL/";
//      var oMockServer = new sap.ui.core.util.MockServer({
//      	rootUri: sUri
//      });
      oMockServer.stop();
      oMockServer.setRequests(oMockServer.getRequests().concat(aMyRequests));
//      oMockServer.simulate("./model/metadata.xml", "./model/");
      oMockServer.start();
//      oMockServer.simulate();//are these settings needed, since we have the scfld mockserver
      jQuery.sap.log.info("Running the app with mock data");
    };
}
)();