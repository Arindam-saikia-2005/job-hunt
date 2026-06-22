import mongoose, { Schema, Types } from "mongoose";

interface ICompany  {
  _id:Types.ObjectId;
  recruiterId:Types.ObjectId;
  name:string;
  description:string;
  website:string;
}

const companySchema = new Schema<ICompany>({
  recruiterId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
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


export const Company = mongoose.models?.Company || mongoose.model<ICompany>("Company",companySchema);