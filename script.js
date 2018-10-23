var GithubIssue = (function(){
    var baseUrl = 'https://api.github.com/users/';
    var GITHUB_API_BASE = 'https://api.github.com/';
    var repositryContainer = document.querySelector('.repocontainer')
    var gForm = $('.gform');
    this.initialLoad = function(){
      initevents()
    }
    
    var reposDataHandler = function(repoArray){
      var htmlRepoString = ''
  
      // Create Loop for Repo Response Array
      for (var i = 0; i < repoArray.length; i++) {
              var repoObject = repoArray[i],
                  repoName = repoObject.name,
                  repoDesc = repoObject.description,
                  repoid = repoObject.id,
                  repourl = repoObject.url,
                  repoNameUrl = repoObject.html_url
  
          // Build an HTML String
              htmlRepoString += '<div class="row card">'
              htmlRepoString += '<div class="repo col-12 card-body" id=loneranger">'
              htmlRepoString += 	'<a class="name" href="' + repoNameUrl + '">' + repoName + '</a>'
              htmlRepoString += 	'<p class="desc">' + repoDesc + '</p>'
              htmlRepoString += 	'<button data-repourl="'+repourl+'" data-repoid="'+repoid+'" class="btn secondary create-issue">create Issue</button>'
              htmlRepoString += '</div>'
              htmlRepoString += '</div>'   
          
      }
      repositryContainer.innerHTML += htmlRepoString 
  } 

  var reportIssue = function(id,username){
    var reportRes = $.post( baseUrl+id+'/'+username, { name: "John", time: "2pm" } );
  }

  var createToken = function (username, password, ele) {
    // github create token
    var s = username + ':' + password;
    var tokenName = Math.random().toString(36).substring(2, 15);
    $.ajax({
      url: GITHUB_API_BASE + 'authorizations',
      type: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(s));
      },
      data: JSON.stringify({
        scopes: ["repo"],
        note: tokenName
      }),
      statusCode: {
        401: function() {
          alert( "invalid Credentials" );
        }
      }
    }).done(function (response) {
      localStorage.setItem('access_token', 'token ' + response.token);
      $('.issueContainer').remove();
     // $(ele).data('repoid');
      $('.create-issue[data-repoid='+$(ele).data('repoid')+']').show().trigger('click');
    });
  
    return false;
  };

  var createIssue = function(){
    var issueForm = $('.issue-form'),
          url = issueForm.find('.repourl').val(),
          title = issueForm.find('.title').val(),
          desc = issueForm.find('.desc').val();
        
        console.log('enter');
    $.ajax({
      type: 'POST',
      url: url + '/issues',
      headers: {
        'Authorization': localStorage.getItem('access_token')
      },
      data: JSON.stringify({
        title: title,
        body: desc
      }),
      success: function (response) {
        $('.title, .desc').val('');
        $('#gm-alert').removeClass('d-none').addClass('d-block').html('Issue has been created successfully!');
        window.scrollTo(0,0);
      },
      error: function () {
        $('#gm-alert').removeClass('d-none').addClass('d-block').html('some error occured while creating issue!');
      },
    });
  };
    
    var initevents = function(){

      gForm.find('.submit').on('click',function(){
        console.log('insidej'+ gForm.find('input.username').val());
        var username = gForm.find('input.username').val();
        var promiseRepos = $.getJSON(baseUrl+username+'/repos');
        promiseRepos.then(reposDataHandler);
        console.log(promiseRepos);
        // gForm.find('input.username').value();
      });

      $(document).on('click', '.login-btn',function(){
        var loginForm = $('.login-form'),
        user = loginForm.find('.user').val(),
        pass = loginForm.find('.password').val();
        createToken(user,pass,this);
      })

      $(document).on('click', '.create-issue',function(){
        $(this).hide();
        var repoURL = $(this).attr('data-repourl'),
           repoid = $(this).attr('data-repoid'),
          issueForm = '';
        if(localStorage.getItem('access_token')){
          
          issueForm += '<div class="issueContainer row">';
          issueForm += '<div  class="issue-form p-4">';
          issueForm += '<input type="hidden" name="repourl" class="repourl" value="'+repoURL+'">';
          issueForm += '<div class="form-group"><h3>Create Issue...</h3>'+
          '<label>title</label>'+
          '<input type="text" name="title" class="title form-control"></div>';
          issueForm += '<div class="form-group">'+
          '<label for="email">Describtion</label>'+
          '<input type="text" name="desc" class="desc form-control"></div>';
          issueForm += '<button data-repoid="'+repoid+'" class="btn btn-outline-info issue-btn">submit</button>';
          issueForm += '</div>';
        } else {
          issueForm += '<div class="issueContainer row">';
          issueForm += '<div  class="login-form p-4">';
          issueForm += '<div class="form-group"><h3>Github Auth needed to create issue..</h3>'+
          '<label>username</label>'+
          '<input type="text" name="user" class="form-control user"></div>';
          issueForm += '<div class="form-group">'+
          '<label>Password</label>'+
          '<input type="password"  name="password" class="form-control password"></div>';
          issueForm += '<button data-repoid="'+repoid+'" class="btn btn-outline-info login-btn">submit</button>';
          issueForm += '</div>';
        }
       

           $(this).after(issueForm);
      });


      $(document).on('click','.issue-btn',function(){
          createIssue();
      });


    }
  
  localStorage.removeItem('access_token');
    
   initialLoad();

  
  })();
  