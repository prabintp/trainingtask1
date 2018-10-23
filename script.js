var GithubIssue = (function(){
    var baseUrl = 'https://api.github.com/users/';
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
              htmlRepoString += '<div class="repoContainer row">'
              htmlRepoString += '<div class="repo col-12" id=loneranger">'
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
    
    var initevents = function(){

      gForm.find('.submit').on('click',function(){
        console.log('insidej'+ gForm.find('input.username').val());
        var username = gForm.find('input.username').val();
        var promiseRepos = $.getJSON(baseUrl+username+'/repos');
        promiseRepos.then(reposDataHandler);
        console.log(promiseRepos);
        // gForm.find('input.username').value();
      });

      $(document).on('click', '.create-issue',function(){
          console.log('dd');
          var repoURL = $(this).attr('data-repourl'),
           issueForm = '';
           issueForm += '<div class="issueContainer row">';
           issueForm += '<div  class="issue-form">';
           issueForm += '<input type="hidden" name="repourl" class="repourl" value="'+repoURL+'">';
           issueForm += '<div class="form-group">'+
           '<label for="email">title</label>'+
           '<input type="text" name="title" class="title"></div>';
           issueForm += '<div class="form-group">'+
           '<label for="email">Describtion</label>'+
           '<input type="text" name="desc" class="desc"></div>';
           issueForm += '<button class="btn secondary issue-btn">submit</button>';
           issueForm += '</div>';

           $(this).after(issueForm);
      });

      $(document).on('click','.issue-btn',function(){
          var issueForm = $('.issue-form'),
          url = issueForm.find('.repourl').val(),
          title = issueForm.find('.title').val(),
          desc = issueForm.find('.desc').val();
          console.log(url + 'ddd');
          var createIssue = $.post( url + '/issues', { title: title, body: desc } );
        console.log('enter');
      });


    }
    
   initialLoad();
  
  })();
  