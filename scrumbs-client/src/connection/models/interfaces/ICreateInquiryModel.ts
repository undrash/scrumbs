

import {InquiryType} from "../constants/InquiryType";



export interface ICreateInquiryModel {
    type: InquiryType,
    name: string,
    description: string
}