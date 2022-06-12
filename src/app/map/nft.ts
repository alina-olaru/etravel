export class NFT {
  title: string = '';
  description: string = '';
  value: number = 40.5;
  imgUrl:string="";
  tags:string[]=[];
  options:any = {};
  label:{
    color:string
    text:string
  }={
    color:'red',
    text:''
  };
  position:{
    lat:number,
    lng:number
  }={
    lat:0,
    lng:0
  }
}
