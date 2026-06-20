import mongoose, { model, Schema, Types } from "mongoose";

interface ICompany  {
  _id:Types.ObjectId;
  recruiterId:Types.ObjectId;
  name:string;
  description:string;
  website:string;
}

const companySchema = new Schema<ICompany>({
  _id:{
    type:mongoose.Schema.Types.ObjectId
  },
  recruiterId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  name:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true
  },
  website:{
    type:String
  }
})


export const Company = model<ICompany>("Company",companySchema);