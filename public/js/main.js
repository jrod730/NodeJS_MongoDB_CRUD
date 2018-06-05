$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
	$('.editUser').on('click', editUser);

});
function deleteUser(){
	var confirmation = confirm('Are you Sure you want to delete?');

	if(confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+$(this).data('id')

		}).done(function(response){
			// window.location.replace('/');
		});
		window.location.replace('/');
	}
	else{
		return false;
	}
}
function editUser(){
	var confirmation = confirm('Are you sure you want to edit?');

	if(confirmation){

		$.ajax({
			type: 'PUT',
			url: '/users/edit/'+$(this).data('id')

		}).done(function(response){
			window.location.replace('/');
		});

	}
	else{
		return false;
	}

}