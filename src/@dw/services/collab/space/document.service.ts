import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
	providedIn: 'root'
})
export class DocumentService {

	constructor(
		private http: HttpClient,
	) { }

	createDoc(docData) {
		return this.http.post('/api/v1/collab/space/doc/create', docData);
	}

	// 문서 삭제
	deleteDoc(docId){	
		return this.http.delete('/api/v1/collab/space/doc/deleteDoc', {params: docId});
	}

	// doc 에 올려진 파일 목록 가져오기
	getUploadFileList(docId){
		return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	// 파일 업로드
	fileUpload(filedata, docId){
		const formData = new FormData();
		formData.append('file', filedata);
		formData.append('docId', docId);
		console.log(formData);
		return this.http.post('/api/v1/collab/space/doc/fileUpload', formData);
	}

	// 업로드된 파일 다운로드
	fileDownload(fileId:any){
		// params를 쓸땐 객체로 보내야한다.
		return this.http.get('/api/v1/collab/space/doc/fileDownload', {params: {fileId: fileId}, responseType: 'blob'});
		// return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	//업로드된 파일 삭제
	deleteUploadFile(fileId){
		console.log(fileId);
		console.log(typeof(fileId))
		return this.http.delete('/api/v1/collab/space/doc/deleteUploadFile', {params: fileId});
	}
	
	// 채팅 생성
	createChat(data){
		return this.http.post('/api/v1/collab/space/doc/createChat', data)
	}

	// doc에 있는 채팅들 가져오기
	getChatInDoc(docId){
		return this.http.get('/api/v1/collab/space/doc/getChatInDoc', {params: docId})
	}

	// 채팅 삭제
	deleteChat(data){
		return this.http.delete('/api/v1/collab/space/doc/deleteChat', {params: data})
	}
	updateDoc(updateDocData) {
		return this.http.put('/api/v1/collab/space/doc/update', updateDocData);
	}
	getInfo(docId) {

		const httpParams = new HttpParams({
			fromObject: {
				docId
			}
		});

		// const paramData = {
		// 	spaceTime
		// }

		return this.http.get('/api/v1/collab/space/doc/getDocInfo', { params: httpParams });
	}

	// 미팅 생성
	createMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/createMeeting', data);
	}

	// 미팅목록 가져오기
	getMeetingList(data){
		return this.http.get('/api/v1/collab/space/doc/getMeetingList', {params: data});
	}

	// 미팅 삭제
	deleteMeeting(data){
		return this.http.delete('/api/v1/collab/space/doc/deleteMeeting', {params: data})
	}

	joinMeeting(data){
		return this.http.post('https://localhost:3000/joinMeeting', data);
	}
}