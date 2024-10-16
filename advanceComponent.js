import { LightningElement, track } from 'lwc';
import fetchAllAcc from '@salesforce/apex/AccountTriggerHandler.fetchAllAcc';
import relatedContacts from '@salesforce/apex/AccountTriggerHandler.relatedContacts';
import relatedOpportunities from '@salesforce/apex/AccountTriggerHandler.relatedOpportunities';
import deleteAccount from '@salesforce/apex/AccountTriggerHandler.deleteAccount';
import getAllCon from '@salesforce/apex/AccountTriggerHandler.getAllCon';
import getAllOpp from '@salesforce/apex/AccountTriggerHandler.getAllOpp';
import deleteContact from '@salesforce/apex/ContactTriggerHandler.deleteContact';
import deleteOpportunity from '@salesforce/apex/OpportunityTriggerHandler.deleteOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AdvanceComponent extends LightningElement {
    @track totalAccount;
    @track accList;
    @track error;
    @track conList;
    @track oppList;
    @track isContacts = false;
    @track isOpps = false;
    @track isShowModal = false;
    @track Id;
    @track conId;
    @track oppId;
    @track isconList = false;
    @track isoppList = false;
    @track isData;
    @track isRecord = false;
    @track isError = false;
    @track isNew = false;
    @track isAcc = false;
    @track isCon = false;
    @track isOpp = false;
    @track viewList = [
                        {"label":"Recently Viewed", "value":"Recently Viewed"},
                        {"label":"All Accounts", "value":"All Accounts"},
                        {"label":"My Accounts", "value":"My Accounts"}
                      ];
    @track viewValue = "Recently Viewed";
    connectedCallback()
    {
        fetchAllAcc({view : "Recently Viewed"})
        .then(result =>{
            this.totalAccount = result.length;
            this.accList = result.map(acc=>({...acc,link:`/${acc.Id}`}));
        })
        .catch(error =>{
            this.isShowModal = true;
            this.isError = true;
            this.error = error;
        })
    }
    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
    handleAccSuccess(event)
    {
        this.showToast('Success', 'Account inserted Successfully! ID: ' + event.detail.id, 'success');
        this.viewValue = "All Accounts";
        fetchAllAcc({view : this.viewValue})
        .then(result => {
            this.totalAccount = result.length;
            console.log(result);
            this.accList = result.map(acc => ({...acc,link:`/${acc.Id}`}));
            this.isShowModal = false;
            this.isAcc = false;
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }

    handleConSuccess(event)
    {
        this.conId = event.detail.id;
        this.showToast('Success', 'Contact inserted Successfully! ID: ' + this.conId, 'success');
        getAllCon({d : this.conId})
        .then(result => {
            this.conList = result.map(con => ({...con, link:`/${con.Id}`}));
            this.isData = "Related Contacts";
            this.isRecord = true;
            this.isNew = false;
            this.isCon = true;
            this.isAcc = false;
            this.isOpp = false;
            if(this.conList.length>0)
            {
                this.isconList = true;
            }
            else
            {
                this.isconList = false;
            }
            this.isContacts = true;
            this.isOpps = false;
            this.isShowModal = true;
            this.isError = false;
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }


    handleOppSuccess(event)
    {
        this.oppId = event.detail.id;
        this.showToast('Success', 'Opportunity inserted Successfully! ID: ' + this.oppId, 'success');
        getAllOpp({d : this.oppId})
        .then(result => {
            this.oppList = result.map(opp => ({...opp, link:`/${opp.Id}`}));
            this.isData = "Related Opportunities";
            this.isRecord = true;
            this.isNew = false;
            this.isCon = false;
            this.isAcc = false;
            this.isOpp = true;
            if(this.oppList.length>0)
            {
                this.isoppList = true;
            }
            else
            {
                this.isoppList = false;
            }
            this.isContacts = false;
            this.isOpps = true;
            this.isShowModal = true;
            this.isError = false;
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }
    handleError(event)
    {
        this.isData = "Error";
        this.isShowModal = true;
        this.isError = true;
        this.isRecord = false;
        this.isNew = false;
        this.error = event.detail.detail;
    }
    getContacts(event)
    {
        this.Id = event.target.id.split('-')[0];
        relatedContacts({accId : this.Id})
        .then(result =>{
            this.conList = result.map(con => ({...con, link:`/${con.Id}`}));
            this.isData = "Related Contacts";
            this.isRecord = true;
            this.isNew = false;
            this.isCon = true;
            this.isAcc = false;
            this.isOpp = false;
            if(this.conList.length>0)
            {
                this.isconList = true;
            }
            else
            {
                this.isconList = false;
            }
            this.isContacts = true;
            this.isOpps = false;
            this.isShowModal = true;
            this.isError = false;
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }
    getOpportunities(event)
    {
        this.Id = event.target.id.split('-')[0];
        relatedOpportunities({accId : this.Id})
        .then(result => {
            this.oppList = result.map(opp => ({...opp, link:`/${opp.Id}`}));
            this.isCon = false;
            this.isAcc = false;
            this.isNew = false;
            this.isOpp = true;
            this.isRecord = true;
            this.isError = false;
            this.isData = "Related Opportunities";
            if(this.oppList.length>0)
            {
                this.isoppList = true;
            }
            else
            {
                this.isoppList = false;
            }
            this.isOpps = true;
            this.isContacts = false;
            this.isShowModal = true;
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }
    deleteContact(event)
    {
        this.conId = event.target.id.split('-')[0];
        deleteContact({d:this.conId})
        .then(result => {
            this.conList = result.map(con => ({...con, link:`/${con.Id}`}));
            if(this.conList.length>0)
            {
                this.isconList = true;
            }
            else
            {
                this.isconList = false;
            }
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }
    deleteOpp(event)
    {
        this.oppId = event.target.id.split('-')[0];
        deleteOpportunity({d : this.oppId})
        .then(result => {
            this.oppList = result.map(opp => ({...opp, link:`/${opp.Id}`}));
            if(this.oppList.length>0)
            {
                this.isoppList = true;
            }
            else
            {
                this.isoppList = false;
            }
        })
        .catch(error => {
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.isRecord = false;
            this.isNew = false;
            this.error = error.body.pageErrors[0].message;
        })
    }
    deleteAccount(event)
    {
        this.Id = event.target.id.split('-')[0];
        deleteAccount({accId : this.Id, view:this.viewValue})
        .then(result=>{
            this.totalAccount = result.length;
            this.accList = result.map(acc => ({...acc,link:`/${acc.Id}`}));
            this.showToast('Success', 'Account DELETED Successfully! ID: ' + this.Id, 'success');
        })
        .catch(error => {
            this.isRecord = false;
            this.isData = "Error";
            this.isShowModal = true;
            this.isError = true;
            this.error = error.body.pageErrors[0].message;
        })
    }

    handleNew()
    {
        this.isNew = true;
        this.isRecord = false;
        this.isError = false;
    }
    handleNewAcc()
    {
        this.isData = "New Account";
        this.isShowModal = true;
        this.isCon = false;
        this.isAcc = true;
        this.isOpp = false;
        this.isNew = true;
        this.isRecord = false;
        this.isError = false;
    }
    hideModalBox()
    {
        this.isShowModal = false;
    }

    handleChange(event)
    {
        this.viewValue = event.detail.value;
        fetchAllAcc({view : this.viewValue})
        .then(result =>{
            this.totalAccount = result.length;
            this.accList = result.map(acc=>({...acc,link:`/${acc.Id}`}));
        })
        .catch(error =>{
            this.isShowModal = true;
            this.isError = true;
            this.error = error;
        })
    }
}