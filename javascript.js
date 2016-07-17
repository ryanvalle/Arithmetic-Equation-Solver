$(function() {
	var $sequence = $('#sequence'),
		$in_d = $('#in-d'),
		$in_s = $('#in-s-of-n'),
		$in_s_val = $('#in-s-of-n-value'),
		$in_a = $('.in-a-of-n'),
		$in_a_val = $('.in-a-of-n-value'),
		$a_wrapper = $('.a-of-n-wrapper'),
		$add_more = $('#add-more-n'),
		$in_a1_val = $('#in-a-of-1-value'),
		$what_to_solve = $("#what-to-solve");
		$n_to_find = $("#n-to-find"),
		$solve = $("#solve")
		$solution = $('#solution');

	$sequence.on("change", function() { checkSequence(); })
	$in_d.on('change', function() { checkD(); })
	$in_s.on('change', function() { checkSofN();})
	$in_s_val.on('change', function() { checkSofN();})
	$('.in-a-of-n').on('change', function() { checkAofN();})
	$('.in-a-of-n-value').on('change', function() { checkAofN();})
	$in_a1_val.on('change', function() { checkA1ofN();})
	$add_more.on('click',function() { addMoreN(); })
	$solve.on('click',function() { solve(); })

	function solve() {
		var sequence = checkSequence();
		var sequence_val = sequence[0]
		var d = checkD();
		var a = sequence[1]
		var s = {}

		var a1_of_n = checkA1ofN()
		var a_of_n = checkAofN()
		var s_of_n = checkSofN()

		var solveFor = $what_to_solve.val()
		var n = $n_to_find.val()

		if (a1_of_n)
			$.extend(a,a1_of_n)
		if (a_of_n)
			$.extend(a,a_of_n)
		if (s_of_n)
			s[s_of_n[0]] = s_of_n[1]

		switch (solveFor) {
			case 'a-of-n':
				solveA(a,s,n,d, true);
				break;
			case 's-of-n':
				solveS(a,s,n,d);
				break;
			default:
				// do nothing
		}
	}

	function solveA(a,s,n,d,sol){
		if (!d)
			d = solveD(a,s)
		a[n] = a[1] + (n - 1) * d

		if(sol)
			printSolution(a[n],n,'a')
		return a[n]
	}

	function solveS(a,s,n,d) {
		a[n] = solveA(a,s,n,d)
		s[n] = (n * (a[1] + a[n])) / 2
		printSolution(s[n],n,'s')
		return s[n]
	}

	function printSolution(sol,n,variable) {
		$solution.html('')
		if (!isNaN(sol)) {
			var print = '<div class="alert alert-success">';
			print += variable
			print += '<span class="subset">' + n + '</span>'
			print += ' = ' + sol
		} else {
			var print = '<div class="alert alert-danger">'
			print += 'COULD NOT SOLVE. Insufficient Information.'
		}

		$solution.append(print);
	}

	function solveD(a,s) {
		var nvals = []

		a_keys = Object.keys(a)
		s_keys = Object.keys(s)
		$(a_keys).each(function(){
			if(this.indexOf(s_keys) >= 0 )
				nvals.push(Number(this))
		})

		var n = nvals[0]

		if (!a[1])
			a[1] = ((s[n] * 2) / n) - a[n]
		d = (a[n] - a[1]) / (n-1)
		$in_d.val(d);
		return Number(d)
	}

	function checkSequence() {
		var sequence = []
		var a = {}
		var that = $("#sequence")
		if ($(that).val().length > 0) {
			arr = $(that).val().split(',')
			$(arr).each(function(x){
				var val = Number(this)
				if (typeof(val) == "number") {
					sequence.push(val)
					a[x + 1] = Number(val);
				}
			})
			var html = sequence.join(', ');
			if (arr.length >= 1) { checkA1ofN(arr[0])}
			if (arr.length >= 2) { checkValForD(arr) }
			printConfirmation('sequence-value', 'Sequence: ',html);
		}
		return [sequence, a]
	}

	function checkValForD() {
		var diff = arr[1] - arr[0]
		$in_d.val(diff)
		checkD()
	}

	function checkD() {
		var value = $in_d.val()
		if (value) { printConfirmation('in-d-value', 'd = ', value) }
		return value
	}

	function checkSofN() {
		var n,val;
		n = $in_s.val()
		val = $in_s_val.val()
		if (n && val) {
			printConfirmation('in-s-value', 'S<span class="subset">'+n+'</span> = ',val)
			return [Number(n),Number(val)]
		}
	}

	function checkAofN() {
		var a_val = {}
		var n, val;
		$('.in-a-of-n').each(function(x) {
			n = $($('.in-a-of-n')[x]).val()
			val = $($('.in-a-of-n-value')[x]).val()
			if (n && val) {
				printConfirmation('in-a-value-'+val+'-'+n, 'a<span class="subset">'+n+'</span> = ',val)
				a_val[n] = Number(val)
			}
		})
		return a_val
	}

	function checkA1ofN(val) {
		if (!val) {
			val = Number($in_a1_val.val())
		}
		if (val) {
			$in_a1_val.val(val)
			printConfirmation('in-a1-value', 'a<span class="subset">1</span> = ',val)
			return [1,val]
		}
	}

	function printConfirmation(id,vanity,value) {
		$('#'+id).remove()
		$('#value-confirmation').append("<li id='"+id+"'>"+vanity+""+value+"</li>")
	}

	function addMoreN(){
		var dup = $('.a-of-n-wrapper').last().html()
		$('.a-of-n-wrapper').last().append('<div class="a-of-n-wrapper">' + dup + '</div>')
		$('.in-a-of-n').unbind('change')
		$('.in-a-of-n-value').unbind('change')
		$('.in-a-of-n').on('change', function() { checkAofN();})
		$('.in-a-of-n-value').on('change', function() { checkAofN();})
	}

})