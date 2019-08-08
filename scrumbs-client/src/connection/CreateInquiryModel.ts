

import {ICreateInquiryModel} from "./models/interfaces/ICreateInquiryModel";
import {InquiryType} from "./models/constants/InquiryType";



export class CreateInquiryModel implements ICreateInquiryModel { constructor(
    public type: InquiryType,
    public name: string,
    public description: string
){}}