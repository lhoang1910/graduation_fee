import React, { useEffect, useState } from "react";
import { notification, Table } from "antd";
import { callExamResults } from "../../../services/api";

const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Mã user",
      dataIndex: "examineeCode",
      key: "examineeCode",
      sorter: true,
    },
    {
      title: "Họ và tên",
      dataIndex: "examineeName",
      key: "examineeName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "examineeEmail",
      key: "examineeEmail",
      sorter: true,
    },
    {
      title: "Mã đề",
      dataIndex: "paperCode",
      key: "paperCode",
      sorter: true,
    },
    {
      title: "Mã lớp học",
      dataIndex: "classCode",
      key: "classCode",
      sorter: true,
    },
    {
      title: "Số lượt đã làm",
      dataIndex: "executionAmount",
      key: "executionAmount",
      sorter: true,
    },
    {
      title: "Số điểm trung bình",
      dataIndex: "averageScore",
      key: "averageScore",
      sorter: true,
    },
  ];



const ExamineeTable = ({examId}) => {
    
    // const result= {
    //     "content": [
    //         {
    //             "id": "c5db8f95-6dd6-4c64-9c18-ed0a7d385e7f",
    //             "examId": "b8f7475b-37e7-477d-9ffd-3c720c7ebb1a",
    //             "candidateNumber": "Q25-04-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-04-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "a61a73ba-245a-4ced-a7f4-110e4a71eea7",
    //             "examId": "82e8f1e9-1a5b-4998-a180-0edf205f2d27",
    //             "candidateNumber": "Q25-05-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-05-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "e0eff97e-eff5-4732-8729-a5e5d4523629",
    //             "examId": "5962e507-211e-449b-a847-7331b99a9872",
    //             "candidateNumber": "Q25-06-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-06-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "e0e2fc48-b84b-4901-931d-8804b1b3a000",
    //             "examId": "fd6151a6-1b24-4914-8e97-b48010c734d1",
    //             "candidateNumber": "Q25-07-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-07-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "e1c6a4bd-cd88-4e75-a3d0-eb60dbb5ae27",
    //             "examId": "6cdb3363-b0af-4523-9203-5db3ba7ce5fd",
    //             "candidateNumber": "Q25-08-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-08-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "11f4063d-c803-4b47-a0b6-4e81efde7b14",
    //             "examId": "99f1e9e2-c3a4-43cc-999a-ca1c642bb600",
    //             "candidateNumber": "Q25-09-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-09-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "41c36d52-fd7e-4bb7-8f90-7ca688d56a75",
    //             "examId": "1a0061f2-2288-48d9-bef9-05e869e745d4",
    //             "candidateNumber": "Q25-10-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-10-MĐ01",
    //             "classCode": null,
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "bf9702d1-95e8-4df6-be84-268b93c7cb3a",
    //             "examId": "0a5e725f-628a-46f0-ab52-170a6a48bebe",
    //             "candidateNumber": "Q25-12-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-12-MĐ01",
    //             "classCode": "C2500001",
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "1d97f0d6-9cc7-473b-bf92-dcf41f5cea7e",
    //             "examId": "c5d728b4-8287-4697-a14d-f3a736284815",
    //             "candidateNumber": "Q25-13-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-13-MĐ01",
    //             "classCode": "C2500001",
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         },
    //         {
    //             "id": "ba9bdc69-a581-417d-bf88-590ca69a6b17",
    //             "examId": "a9592dd4-85b0-4d87-9999-bbe47304c3aa",
    //             "candidateNumber": "Q25-14-MĐ00",
    //             "examineeId": "39d0d41f-d61d-4948-9df5-d99e0a529899",
    //             "examineeName": "Lê Huy Hoàngg",
    //             "examineeCode": "U2500001",
    //             "examineeEmail": "hoang03.it@gmail.com",
    //             "paperCode": "Q25-14-MĐ01",
    //             "classCode": "C2500001",
    //             "executionAmount": 0,
    //             "averageScore": 0.0
    //         }
    //     ],
    //     "pageable": {
    //         "sort": {
    //             "empty": true,
    //             "sorted": false,
    //             "unsorted": true
    //         },
    //         "offset": 0,
    //         "pageNumber": 0,
    //         "pageSize": 10,
    //         "paged": true,
    //         "unpaged": false
    //     },
    //     "last": false,
    //     "totalPages": 2,
    //     "totalElements": 19,
    //     "size": 10,
    //     "number": 0,
    //     "sort": {
    //         "empty": true,
    //         "sorted": false,
    //         "unsorted": true
    //     },
    //     "numberOfElements": 10,
    //     "first": true,
    //     "empty": false
    // }
    const handleTableChange = (pagination, filters, sorter) => {
        console.log(sorter)
        if(sorter){
            let asc ;
            if(sorter.order==="ascend"){
                asc = true;
            }
            if(sorter.order==="descend"){
                asc = false;
            }
            if(asc===false || asc ===true){
                fetchData({key:sorter.columnKey,asc});

            }else{
                fetchData();
            }
        }

      };


      const [data, setData] = useState({});
      const [page, setPage] = useState(1 );

      const [loading, setLoading] = useState(false);
    
      const fetchData = async (sorter = null) => {
        console.log("data",data)
        setLoading(true);
        try {
            let request = {viewType:"EXAM_RESULT_VIEW",examId,pageSize:10,pageNumber:page-1}
            if(sorter){
                request = {viewType:"EXAM_RESULT_VIEW",examId,pageSize:10,pageNumber:page-1,
                     "sortCriteria": [
                        {
                            "key": sorter.key, // tên field cần sort theo
                            "asc": sorter.asc // true: tăng dần - false: giảm dần
                        }
                    ]}
            }
          const response = await callExamResults(request)
          if(response.success){
            setData(response.data);

          }else{
            notification.error({message:response.message})
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      };
    
      useEffect (() => {
        fetchData();
      }, [  ]);
  return <Table  loading={loading} columns={columns}  dataSource={data?.content}       onChange={handleTableChange}
          pagination={{ total:data?.totalElements     ,pageSize: 10,onChange:(page,pageSize)=>{
            setPage(page);


  } }} />;
};

export default ExamineeTable;
